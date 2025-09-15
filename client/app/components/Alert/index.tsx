import { CSSProperties, useEffect, useState, useRef } from 'react';
import styles from './styles.module.css';

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message?: string;
  style?: CSSProperties;
  autoDismiss?: boolean;
  dismissAfter?: number; // milliseconds
  onDismiss?: () => void;
}

export const Alert = ({
  type,
  message,
  style,
  autoDismiss = false,
  dismissAfter = 5000,
  onDismiss,
}: AlertProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (autoDismiss && dismissAfter > 0 && isVisible) {
      // Clear any existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        setIsVisible(false);
        onDismiss?.();
      }, dismissAfter);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [autoDismiss, dismissAfter, isVisible, onDismiss]);

  if (!isVisible) {
    return null;
  }

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  return (
    <div className={`${styles.alert} ${styles[type]}`} style={style}>
      <span className={styles['alert-message']}>{message}</span>
      <button
        className={styles['dismiss-button']}
        onClick={handleDismiss}
        aria-label="Dismiss alert"
      >
        ×
      </button>
    </div>
  );
};
