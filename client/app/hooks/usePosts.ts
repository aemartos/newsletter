import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { fetchPost, fetchPosts, type GetPostsParams } from '../lib';

const STALE_TIME = 1000 * 60 * 5; // 5 minutes

export const usePost = (slug: string) => {
  return useQuery({
    queryKey: ['post', slug],
    queryFn: () => fetchPost(slug),
    staleTime: STALE_TIME,
  });
};

export const useInfinitePosts = (params: GetPostsParams = {}) => {
  return useInfiniteQuery({
    queryKey: ['posts', 'list', params],
    queryFn: ({ pageParam }) => fetchPosts({ ...params, cursor: pageParam }),
    initialPageParam: params.cursor || undefined,
    getNextPageParam: lastPage => {
      return lastPage.data.pagination.nextCursor;
    },
    staleTime: STALE_TIME,
  });
};
