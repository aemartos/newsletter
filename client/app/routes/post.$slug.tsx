import { useLoaderData } from 'react-router';
import { fetchPost, Routes } from '../lib';
import { Header, Button } from '../components';
import styles from './styles.module.css';
import { formatDate } from '../utils';

export async function loader({ params }: { params: { slug: string } }) {
  try {
    const post = await fetchPost(params.slug);
    return { post };
  } catch (error) {
    return { post: null, error: 'Post not found' };
  }
}

export default function PostView() {
  const { post, error } = useLoaderData<typeof loader>();

  if (error || !post) {
    return (
      <div className={styles.container}>
        <Header title="Post Not Found" />
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Post not found</h2>
          <p>
            The post you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Button
        to={Routes.HOME}
        text="←"
        kind="inverted-dark"
        style={{
          marginLeft: 'var(--spacing-4)',
          marginTop: 'var(--spacing-4)',
          width: 'fit-content',
          padding: '0 var(--spacing-3)',
        }}
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
