import styles from './styles.module.css';

interface CardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    publishedAt: string | null;
    readTime: number | null;
    category: string | null;
    createdAt: string;
  };
  style?: React.CSSProperties;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const year = date.getFullYear().toString().slice(-2);
  return `${day} ${month} ${year}`;
};

export const Card = ({ post, style }: CardProps) => {
  const displayDate = post.publishedAt || post.createdAt;

  return (
    <div className={styles.card} style={style}>
      <div className={styles['card-header']}>
        <span className={styles.date}>{formatDate(displayDate)}</span>
        {post.category && (
          <span className={styles.category}>{post.category}</span>
        )}
      </div>
      <h4 className={styles.title}>{post.title}</h4>
      {post.excerpt && <p className={styles.excerpt}>{post.excerpt}</p>}
      <div className={styles['card-footer']}>
        {post.readTime && (
          <span className={styles['read-time']}>{post.readTime} min read</span>
        )}
      </div>
    </div>
  );
};
