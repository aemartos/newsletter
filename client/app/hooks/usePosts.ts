import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchPosts, type GetPostsParams, type PostsResponse } from '../lib';

const STALE_TIME = 1000 * 60 * 5; // 5 minutes

export const useInfinitePosts = (
  params: GetPostsParams = {},
  options?: {
    initialData?: {
      pages: PostsResponse[];
      pageParams: (string | null | undefined)[];
    };
  }
) => {
  return useInfiniteQuery({
    queryKey: ['posts', 'list', params],
    queryFn: ({ pageParam }) => fetchPosts({ ...params, cursor: pageParam }),
    initialPageParam: params.cursor || undefined,
    getNextPageParam: lastPage => {
      return lastPage.data.pagination.nextCursor;
    },
    staleTime: STALE_TIME,
    initialData: options?.initialData,
  });
};
