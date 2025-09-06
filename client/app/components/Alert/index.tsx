import { useEffect, useState } from 'react';
import styles from './styles.module.css';

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message?: string;
  style?: React.CSSProperties;
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

  useEffect(() => {
    if (autoDismiss && dismissAfter > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onDismiss?.();
      }, dismissAfter);

      return () => clearTimeout(timer);
    }
  }, [autoDismiss, dismissAfter, onDismiss]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`${styles.alert} ${styles[type]}`} style={style}>
      {message}
    </div>
  );
};
