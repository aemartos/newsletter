import { Link } from 'react-router';
import { Header, Input, Button } from '../components';
import { Routes } from '../lib';
import styles from './styles.module.css';

const Subscribe = () => {
  return (
    <>
      <img
        className={styles['newsletter-image']}
        src="/images/newsletter.jpg"
        alt="newsletter"
      />
      <Header
        title="Do you wanna know more"
        description="Subscribe to our newsletter!"
      />
      <form className={styles['form-subscribe']}>
        <Input
          type="email"
          placeholder="Email"
          style={{
            borderTopRightRadius: '0',
            borderBottomRightRadius: '0',
            borderRight: 'none',
            borderWidth: '2px',
          }}
        />
        <Button
          type="submit"
          text="Subscribe"
          style={{ borderTopLeftRadius: '0', borderBottomLeftRadius: '0' }}
        />
      </form>
      <Link style={{ marginTop: 'var(--spacing-6)' }} to={Routes.HOME}>
        Let me read some articles first →
      </Link>
    </>
  );
};

export default Subscribe;
