import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { Header, Alert, iAlert } from '../components';
import { Routes, unsubscribe } from '../lib';
import { subscriberSchema, validateData } from '../validation';
import styles from './styles.module.css';

const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const [alert, setAlert] = useState<iAlert | null>(null);

  useEffect(() => {
    const email = searchParams.get('email');

    if (email) {
      const validation = validateData(subscriberSchema, {
        email,
      });

      if (!validation.success) {
        setAlert({ type: 'error', message: 'Invalid email address' });
        return;
      }

      unsubscribe(email)
        .then(() => {
          setAlert({ type: 'success', message: 'Successfully unsubscribed!' });
        })
        .catch(() => {
          setAlert({
            type: 'error',
            message: 'Failed to unsubscribe. Please try again.',
          });
        });
    }
  }, [searchParams]);

  return (
    <>
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          autoDismiss
          dismissAfter={5000}
          onDismiss={() => setAlert(null)}
        />
      )}
      <img
        className={styles['newsletter-image']}
        src="/images/unsubscribe.jpg"
        alt="unsubscribe from our newsletter"
      />
      <Header title="Sorry to see you go!" description="We'll miss you!" />
      <Link style={{ marginTop: 'var(--spacing-6)' }} to={Routes.SUBSCRIBE}>
        Subscribe again →
      </Link>
    </>
  );
};

export default Unsubscribe;
