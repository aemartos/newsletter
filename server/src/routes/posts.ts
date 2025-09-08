import express from 'express';
import { prismaClient, PostStatus } from '../prisma.js';
import { Queues, jobProcessor } from '../lib/jobs/index.js';
import { PUBLISH_RETRY } from '../workers/consts.js';

const router: express.Router = express.Router();

router.get('/', async (req, res) => {
  const {
    limit = '10',
    status = PostStatus.PUBLISHED,
    cursor = '',
    sortBy = 'publishedAt',
    sortOrder = 'desc',
  } = req.query;

  const limitNum = Math.min(parseInt(limit as string, 10), 50); // Max 50 posts per page
  const postStatus = status as string;
  const sortField = sortBy as string;
  const sortDirection = sortOrder as 'asc' | 'desc';

  const validSortField = [
    'publishedAt',
    'createdAt',
    'title',
    'readTime',
  ].includes(sortField)
    ? sortField
    : 'publishedAt';

  const where: Record<string, unknown> = {
    status: postStatus,
  };

  if (cursor) {
    const cursorDate = new Date(cursor as string);
    if (validSortField === 'publishedAt') {
      where.publishedAt =
        sortDirection === 'desc' ? { lt: cursorDate } : { gt: cursorDate };
    } else if (validSortField === 'createdAt') {
      where.createdAt =
        sortDirection === 'desc' ? { lt: cursorDate } : { gt: cursorDate };
    }
  }

  const totalCount = await prismaClient.post.count({ where });

  const posts = await prismaClient.post.findMany({
    where,
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      publishedAt: true,
      readTime: true,
      category: true,
      createdAt: true,
    },
    orderBy: {
      [validSortField]: sortDirection,
    },
    take: limitNum + 1, // Take one extra to check if there are more pages
  });

  // Check if there are more pages
  const hasMore = posts.length > limitNum;
  const actualPosts = hasMore ? posts.slice(0, limitNum) : posts;

  // Generate next cursor (using the last post's timestamp)
  const nextCursor =
    hasMore && actualPosts.length > 0
      ? actualPosts[actualPosts.length - 1][validSortField]?.toISOString()
      : null;

  return res.json({
    success: true,
    data: {
      posts: actualPosts,
      pagination: {
        nextCursor,
        totalCount,
      },
    },
  });
});

router.get('/:slug', async (req, res) => {
  const { slug } = req.params;
  const post = await prismaClient.post.findUnique({
    where: { slug, status: PostStatus.PUBLISHED },
  });

  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Post not found',
    });
  }

  return res.json({ success: true, data: post });
});

router.post('/', async (req, res) => {
  try {
    const {
      title,
      slug,
      schedule,
      excerpt,
      content,
      readTime = 2,
      category = 'Architecture',
    } = req.body;

    const existingPost = await prismaClient.post.findUnique({
      where: { slug },
    });
    if (existingPost) {
      return res.status(400).json({
        success: false,
        message: 'Post with this slug already exists',
      });
    }

    const now = Date.now();
    const scheduleDate = schedule ? new Date(schedule) : null;
    const isFuture = !!(scheduleDate && scheduleDate.getTime() > now);

    const post = await prismaClient.post.create({
      data: {
        title,
        slug,
        schedule: scheduleDate,
        excerpt,
        content,
        status: isFuture ? PostStatus.DRAFT : PostStatus.PUBLISHED,
        publishedAt: isFuture ? null : new Date(),
        readTime,
        category,
      },
    });

    if (isFuture) {
      await jobProcessor.sendAfter(
        Queues.NEWSLETTER.PUBLISH_POST,
        { slug: post.slug },
        {
          ...PUBLISH_RETRY,
          singletonKey: `publish:${post.id}:${scheduleDate.toISOString()}`,
        },
        scheduleDate
      );
    } else {
      await jobProcessor.send(
        Queues.NEWSLETTER.PUBLISH_POST,
        { slug: post.slug },
        {
          ...PUBLISH_RETRY,
          singletonKey: `publish:${post.id}`,
        }
      );
    }

    return res.json({ success: true, data: post });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Failed to create post: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }
});

export default router;
