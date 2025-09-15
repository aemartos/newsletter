import express from 'express';
import { prismaClient, PostStatus } from '../prisma.js';
import { Queues, jobProcessor } from '../lib/jobs/index.js';
import { PUBLISH_RETRY } from '../workers/consts.js';
import {
  validate,
  createPostSchema,
  getPostsSchema,
  getPostSchema,
} from '../validation/index.js';

const router: express.Router = express.Router();

router.get('/', validate(getPostsSchema, 'query'), async (req, res) => {
  try {
    const { limit, status, cursor, sortBy, sortOrder } = req.query;

    const where: Record<string, unknown> = {
      status,
    };

    if (cursor) {
      const cursorDate = new Date(cursor as string);
      if (sortBy === 'publishedAt') {
        where.publishedAt =
          sortOrder === 'desc' ? { lt: cursorDate } : { gt: cursorDate };
      } else if (sortBy === 'createdAt') {
        where.createdAt =
          sortOrder === 'desc' ? { lt: cursorDate } : { gt: cursorDate };
      }
    }

    const totalCount = await prismaClient.post.count({ where });

    const limitNum = limit as unknown as number;

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
        [sortBy as string]: sortOrder,
      },
      take: limitNum + 1, // Take one extra to check if there are more pages
    });

    // Check if there are more pages
    const hasMore = posts.length > limitNum;
    const actualPosts = hasMore ? posts.slice(0, limitNum) : posts;

    // Generate next cursor (using the last post's timestamp)
    const nextCursor =
      hasMore && actualPosts.length > 0
        ? actualPosts[actualPosts.length - 1][sortBy as string].toISOString()
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch posts',
    });
  }
});

router.get('/:slug', validate(getPostSchema, 'params'), async (req, res) => {
  try {
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch post',
    });
  }
});

router.post('/', validate(createPostSchema, 'body'), async (req, res) => {
  try {
    const { title, slug, schedule, excerpt, content, readTime, category } =
      req.body;

    const existingPost = await prismaClient.post.findUnique({
      where: { slug },
    });
    if (existingPost) {
      return res.status(400).json({
        success: false,
        message: 'Post with this slug already exists',
      });
    }

    const now = new Date();

    const scheduleDate = schedule ? new Date(schedule) : null;
    const isFuture = scheduleDate ? scheduleDate > now : false;

    const post = await prismaClient.post.create({
      data: {
        title,
        slug,
        schedule: scheduleDate,
        excerpt,
        content,
        status: isFuture ? PostStatus.DRAFT : PostStatus.PUBLISHED,
        publishedAt: isFuture ? null : now,
        readTime,
        category,
      },
    });

    if (isFuture && scheduleDate) {
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
