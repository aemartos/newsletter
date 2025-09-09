import { clientConfig } from '../config/index.js';

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

  try {
    const response = await fetch(
      `${getApiBaseUrl()}/posts?${searchParams.toString()}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    throw new Error(
      `Failed to fetch posts: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

export const fetchPost = async (slug: string): Promise<Post> => {
  try {
    const response = await fetch(`${getApiBaseUrl()}/posts/${slug}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Post not found');
      }
      throw new Error(`Failed to fetch post: ${response.statusText}`);
    }
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch post');
    }
    return result.data;
  } catch (error) {
    throw new Error(
      `Failed to fetch post: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

export const createPost = async (post: Partial<Post>): Promise<void> => {
  try {
    const response = await fetch(`${getApiBaseUrl()}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create post');
    }
    return response.json();
  } catch (error) {
    throw new Error(
      `Failed to create post: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

export const createSubscriber = async (email: string): Promise<void> => {
  try {
    const response = await fetch(`${getApiBaseUrl()}/subscribers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          `Failed to create subscriber: ${response.statusText}`
      );
    }
    return response.json();
  } catch (error) {
    throw new Error(
      `Failed to create subscriber: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};
