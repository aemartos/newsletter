import { clientConfig } from '../config/index.js';
import { handleApiError, AppError } from './errors.js';

const getApiBaseUrl = () => clientConfig.api.baseUrl;

export const PostStatus = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  DELETED: 'DELETED',
} as const;

export type PostStatusType = (typeof PostStatus)[keyof typeof PostStatus];

export interface Post {
  id: string;
  title: string;
  slug: string;
  schedule: string | null;
  excerpt: string | null;
  content: string | null;
  status: PostStatusType;
  publishedAt: string | null;
  readTime: number | null;
  category: string | null;
  createdAt: string;
}

export interface PostsResponse {
  success: boolean;
  data: {
    posts: Post[];
    pagination: {
      nextCursor: string | null;
      totalCount: number;
    };
  };
}

export interface GetPostsParams {
  limit?: number;
  status?: PostStatusType;
  cursor?: string | null;
  sortBy?: 'publishedAt' | 'createdAt' | 'title' | 'readTime';
  sortOrder?: 'asc' | 'desc';
}

export const fetchPosts = async (
  params: GetPostsParams = {}
): Promise<PostsResponse> => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  const response = await fetch(
    `${getApiBaseUrl()}/posts?${searchParams.toString()}`
  );

  if (!response.ok) {
    await handleApiError(response);
  }

  return response.json();
};

export const fetchPost = async (slug: string): Promise<Post> => {
  const response = await fetch(`${getApiBaseUrl()}/posts/${slug}`);

  if (!response.ok) {
    await handleApiError(response);
  }

  const result = await response.json();
  if (!result.success) {
    throw new AppError(
      result.message || 'Failed to fetch post',
      response.status,
      'UNKNOWN_ERROR'
    );
  }

  return result.data;
};

export const createPost = async (post: Partial<Post>): Promise<void> => {
  const response = await fetch(`${getApiBaseUrl()}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(post),
  });

  if (!response.ok) {
    await handleApiError(response);
  }

  return response.json();
};

export const createSubscriber = async (email: string): Promise<void> => {
  const response = await fetch(`${getApiBaseUrl()}/subscribers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    await handleApiError(response);
  }

  return response.json();
};
