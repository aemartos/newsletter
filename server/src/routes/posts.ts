import express from 'express';
import { prismaClient } from '../../prisma/prisma.js';

const router: express.Router = express.Router();

router.get('/', async (req, res) => {
  const {
    limit = '10',
    published = 'true',
    cursor = '',
    sortBy = 'publishedAt',
    sortOrder = 'desc',
  } = req.query;

  const limitNum = Math.min(parseInt(limit as string, 10), 50); // Max 50 posts per page
  const isPublished = published === 'true';
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
    published: isPublished,
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

  res.json({
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
    where: { slug },
  });

  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Post not found',
    });
  }

  res.json({ success: true, data: post });
});

export default router;
