import { z } from 'zod';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

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
      if (!val) return true;
      const date = new Date(val);
      return !isNaN(date.getTime()) && date > new Date();
    }, 'Schedule must be a valid future date'),
});

export const createSubscriberSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .regex(emailPattern, 'Invalid email format')
    .max(255, 'Email must be less than 255 characters')
    .toLowerCase()
    .trim(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type CreateSubscriberInput = z.infer<typeof createSubscriberSchema>;
