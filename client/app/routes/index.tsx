import { useEffect } from 'react';
import { useLoaderData } from 'react-router';
import { Header, Card, Button, Spinner } from '../components';
import { useInfinitePosts } from '../hooks/usePosts';
import { fetchPosts, GetPostsParams, PostStatus, PostsResponse } from '../lib';
import { Routes } from '../lib';
import styles from './styles.module.css';

const filters: GetPostsParams = {
  limit: 8,
  status: PostStatus.PUBLISHED,
  sortBy: 'publishedAt',
  sortOrder: 'desc',
};

type IndexLoaderData = {
  initialPosts: PostsResponse | null;
  error: string | null;
};

export async function loader(): Promise<IndexLoaderData> {
  try {
    const initialPosts = await fetchPosts(filters);
    return { initialPosts, error: null };
  } catch (error) {
    return {
      initialPosts: null,
      error: error instanceof Error ? error.message : 'Failed to load posts',
    };
  }
}

const Index = () => {
  const { initialPosts, error: loaderError } = useLoaderData<IndexLoaderData>();

  // Use infinite query for pagination, starting with server-fetched data
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error: queryError,
  } = useInfinitePosts(filters, {
    initialData: initialPosts
      ? {
          pages: [initialPosts],
          pageParams: [undefined],
        }
      : undefined,
  });

  const posts = data?.pages.flatMap(page => page.data.posts) ?? [];
  const error = loaderError || queryError;

  useEffect(() => {
    const handleScroll = () => {
      if (!hasNextPage || isFetchingNextPage) return;

      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      const threshold = 200; // Load more when 200px from bottom
      const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);

      if (distanceFromBottom <= threshold) {
        fetchNextPage();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className={styles.container}>
      <Header
        title="Bla bla... newsletter!"
        description="written by tech people, for tech people"
        style={{
          paddingTop: 'var(--spacing-12)',
        }}
      />
      <Button
        to={Routes.SUBSCRIBE}
        kind="dark"
        text="subscribe"
        style={{
          width: 'fit-content',
          margin: '0 auto',
          height: 'var(--input-sm-height)',
        }}
      />
      <div className={styles.posts}>
        <div className={styles['posts-header']}>
          <h2 className={styles['posts-title']}>Recent posts!</h2>
          <Button
            to={Routes.POSTS_NEW}
            text="new"
            kind="inverted-dark"
            style={{
              height: 'var(--input-sm-height)',
            }}
          />
        </div>
        <div className={styles['posts-list']}>
          {error ? (
            <div className={styles.error}>
              <p>Failed to load posts. Please try again later.</p>
            </div>
          ) : (
            posts.map(post => <Card key={post.id} post={post} />)
          )}
        </div>
        {(isFetchingNextPage || isLoading) && !error && (
          <Spinner wrapperStyle={{ height: '100px' }} />
        )}
      </div>
    </div>
  );
};

export default Index;
