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
import { asyncHandler } from '../lib/errors/middlewares.js';
import { NotFoundError, ConflictError } from '../lib/errors/index.js';

const router: express.Router = express.Router();

router.get(
  '/',
  validate(getPostsSchema, 'query'),
  asyncHandler(async (req, res) => {
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
  })
);

router.get(
  '/:slug',
  validate(getPostSchema, 'params'),
  asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const post = await prismaClient.post.findUnique({
      where: { slug, status: PostStatus.PUBLISHED },
    });

    if (!post) {
      throw new NotFoundError('Post');
    }

    res.json({ success: true, data: post });
  })
);

router.post(
  '/',
  validate(createPostSchema, 'body'),
  asyncHandler(async (req, res) => {
    const { title, slug, schedule, excerpt, content, readTime, category } =
      req.body;

    const existingPost = await prismaClient.post.findUnique({
      where: { slug },
    });
    if (existingPost) {
      throw new ConflictError('Post with this slug already exists');
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

    res.json({ success: true, data: post });
  })
);

export default router;
