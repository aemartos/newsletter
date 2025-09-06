import { Link, useActionData } from 'react-router';
import { Header, Input, Button, Alert } from '../components';
import { Routes, createSubscriber } from '../lib';
import { useState, useEffect } from 'react';
import styles from './styles.module.css';

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const email = formData.get('email') as string;
  try {
    await createSubscriber(email);
    return {
      success: true,
      message: 'Successfully subscribed to our newsletter!',
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to subscribe. Please try again later.',
    };
  }
};

const Subscribe = () => {
  const actionData = useActionData() as
    | { success?: boolean; error?: string; message?: string }
    | undefined;
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (actionData) {
      setIsSubmitting(false);
    }
  }, [actionData]);

  return (
    <>
      {actionData && (
        <Alert
          type={actionData.success ? 'success' : 'error'}
          message={actionData.success ? actionData.message : actionData.error}
          // autoDismiss={actionData.success}
          autoDismiss
          dismissAfter={3000}
        />
      )}
      <img
        className={styles['newsletter-image']}
        src="/images/newsletter.jpg"
        alt="newsletter"
      />
      <Header
        title="Do you wanna know more"
        description="Subscribe to our newsletter!"
      />
      <form
        method="post"
        onSubmit={() => setIsSubmitting(true)}
        className={styles['form-subscribe']}
      >
        <Input
          type="email"
          name="email"
          placeholder="Email"
          required
          style={{
            borderTopRightRadius: '0',
            borderBottomRightRadius: '0',
            borderRight: 'none',
            borderWidth: '2px',
          }}
        />
        <Button
          type="submit"
          text={isSubmitting ? 'Subscribing...' : 'Subscribe'}
          disabled={isSubmitting}
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
