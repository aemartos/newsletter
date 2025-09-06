import { useLoaderData } from 'react-router';
import { useEffect } from 'react';
import { Header, Card, Button, Spinner } from '../components';
import { useInfinitePosts } from '../hooks/usePosts';
import { fetchPosts, GetPostsParams, Routes, PostStatus } from '../lib';
import styles from './styles.module.css';

const filters: GetPostsParams = {
  limit: 8,
  status: PostStatus.PUBLISHED,
  sortBy: 'publishedAt',
  sortOrder: 'desc',
};

export async function loader() {
  try {
    const postsResponse = await fetchPosts(filters);
    return {
      initialPosts: postsResponse.data.posts,
      nextCursor: postsResponse.data.pagination.nextCursor,
    };
  } catch (error) {
    console.error('Error in postsLoader:', error);
    return {
      initialPosts: [],
      nextCursor: null,
    };
  }
}

const Index = () => {
  const { initialPosts, nextCursor } = useLoaderData<typeof loader>();

  // Use infinite query for infinite scroll, starting from the cursor after SSR posts
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfinitePosts({
    cursor: nextCursor, // Start from the cursor after the SSR posts
    ...filters,
  });

  // Get all posts from infinite query
  const infinitePosts = data?.pages.flatMap(page => page.data.posts) ?? [];

  const allPosts = [...initialPosts, ...infinitePosts];

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
            allPosts.map(post => <Card key={post.id} post={post} />)
          )}
        </div>
        {(isFetchingNextPage || isLoading) && (
          <span
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '10em',
            }}
          >
            <Spinner />
          </span>
        )}
      </div>
    </div>
  );
};

export default Index;
