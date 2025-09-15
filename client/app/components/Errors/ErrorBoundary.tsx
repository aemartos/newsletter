import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { Button, Header, Layout } from '..';
import { Routes } from '../../lib';
import styles from './styles.module.css';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <Layout showMenu={false} centered={true}>
      <div className={styles['error-fallback']}>
        <Header
          title="Something went wrong"
          description="We encountered an unexpected error. Please try again."
          style={{ marginBottom: '2rem' }}
        />

        <div className={styles['error-details']}>
          <p className={styles['error-message']}>{error.message}</p>
          {process.env.NODE_ENV === 'development' && (
            <details className={styles['error-stack']}>
              <summary>Error Details (Development)</summary>
              <pre>{error.stack}</pre>
            </details>
          )}
        </div>

        <div className={styles['error-actions']}>
          <Button onClick={resetErrorBoundary} text="Try Again" />
          <Button
            onClick={() => (window.location.href = Routes.HOME)}
            text="Go Home"
            kind="dark"
          />
        </div>
      </div>
    </Layout>
  );
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  onError?: (error: Error, errorInfo: { componentStack: string }) => void;
}

export function ErrorBoundary({ children, onError }: ErrorBoundaryProps) {
  const handleError = (error: Error, errorInfo: { componentStack: string }) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error);
      console.error('Component stack:', errorInfo.componentStack);
    }

    onError?.(error, errorInfo);
  };

  const ErrorBoundaryComponent = ReactErrorBoundary as any;

  return (
    <ErrorBoundaryComponent
      FallbackComponent={ErrorFallback}
      onError={handleError}
      onReset={() => {
        // Clear any error state when reset is called
        window.location.reload();
      }}
    >
      {children}
    </ErrorBoundaryComponent>
  );
}
