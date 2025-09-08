import { useLoaderData } from 'react-router';
import { Routes, fetchPost, Post } from '../lib';
import { Header, Button, GenericError } from '../components';
import styles from './styles.module.css';
import { formatDate } from '../utils';

type PostLoaderData = {
  post: Post | null;
  error: string | null;
};

export async function loader({
  params,
}: {
  params: { slug: string };
}): Promise<PostLoaderData> {
  try {
    const post = await fetchPost(params.slug);
    return { post, error: null };
  } catch (error) {
    return {
      post: null,
      error: error instanceof Error ? error.message : 'Post not found',
    };
  }
}

export default function PostView() {
  const { post, error } = useLoaderData<PostLoaderData>();

  if (error || !post) {
    return (
      <GenericError
        title="Post not found"
        description="The post you're looking for doesn't exist or has been removed."
      />
    );
  }

  return (
    <div className={styles.container}>
      <Button
        to={Routes.HOME}
        text="←"
        kind="inverted-dark"
        className={styles['back-button']}
      />
      <Header
        title={post.title}
        description={post.excerpt || undefined}
        style={{
          paddingTop: 'var(--spacing-12)',
        }}
      />

      <article className={styles.post}>
        <div className={styles['post-meta']}>
          <div className={styles['post-meta-left']}>
            <time className={styles.date}>
              {formatDate(post.publishedAt || post.createdAt)}
            </time>
            {post.readTime && (
              <span className={styles['read-time']}>
                {post.readTime} min read
              </span>
            )}
          </div>
          {post.category && (
            <span className={styles.category}>{post.category}</span>
          )}
        </div>
        {post.content && (
          <div
            className={styles['post-content']}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        )}
      </article>
    </div>
  );
}
