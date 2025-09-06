/// <reference types="vite/client" />

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
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
  published?: boolean;
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
      `${API_BASE_URL}/posts?${searchParams.toString()}`
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
    const response = await fetch(`${API_BASE_URL}/posts/${slug}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch post: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    throw new Error(
      `Failed to fetch post: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

export const createSubscriber = async (email: string): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/subscribers`, {
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
