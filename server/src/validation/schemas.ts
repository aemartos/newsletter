import { z } from 'zod';

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Post validation schemas
export const createPostSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must be less than 200 characters')
    .trim(),

  slug: z
    .string()
    .min(1, 'Slug is required')
    .min(3, 'Slug must be at least 3 characters')
    .max(100, 'Slug must be less than 100 characters')
    .regex(
      slugPattern,
      'Slug must contain only lowercase letters, numbers, and hyphens'
    )
    .trim(),

  excerpt: z
    .string()
    .min(1, 'Excerpt is required')
    .min(10, 'Excerpt must be at least 10 characters')
    .max(500, 'Excerpt must be less than 500 characters')
    .trim(),

  content: z
    .string()
    .min(1, 'Content is required')
    .min(50, 'Content must be at least 50 characters')
    .max(50000, 'Content must be less than 50,000 characters'),

  schedule: z
    .string()
    .optional()
    .refine(val => {
      if (!val || val.trim() === '') return true;
      const date = new Date(val);
      return !isNaN(date.getTime()) && date > new Date();
    }, 'Schedule must be a valid future date'),

  readTime: z
    .number()
    .int()
    .min(1, 'Read time must be at least 1 minute')
    .max(60, 'Read time must be less than 60 minutes')
    .optional()
    .default(2),

  category: z
    .string()
    .min(1, 'Category is required')
    .max(50, 'Category must be less than 50 characters')
    .trim()
    .optional()
    .default('Architecture'),
});

export const getPostSchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(slugPattern, 'Invalid slug format'),
});

export const getPostsSchema = z.object({
  limit: z
    .string()
    .optional()
    .transform(val => {
      const num = val ? parseInt(val, 10) : 10;
      return Math.min(Math.max(num, 1), 50);
    }),

  status: z
    .enum(['DRAFT', 'PUBLISHED', 'DELETED'])
    .optional()
    .default('PUBLISHED'),

  cursor: z
    .string()
    .optional()
    .refine(val => {
      if (!val) return true;
      const date = new Date(val);
      return !isNaN(date.getTime());
    }, 'Invalid cursor format'),

  sortBy: z
    .enum(['publishedAt', 'createdAt', 'title', 'readTime'])
    .optional()
    .default('publishedAt'),

  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

// Subscriber validation schemas
export const subscriberSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .regex(emailPattern, 'Invalid email format')
    .max(255, 'Email must be less than 255 characters')
    .toLowerCase()
    .trim(),
});

// Common validation schemas
export const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .transform(val => {
      const num = val ? parseInt(val, 10) : 1;
      return Math.max(num, 1);
    }),

  limit: z
    .string()
    .optional()
    .transform(val => {
      const num = val ? parseInt(val, 10) : 10;
      return Math.min(Math.max(num, 1), 100);
    }),
});

// Type exports for TypeScript
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type GetPostInput = z.infer<typeof getPostSchema>;
export type GetPostsInput = z.infer<typeof getPostsSchema>;
export type SubscriberInput = z.infer<typeof subscriberSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
