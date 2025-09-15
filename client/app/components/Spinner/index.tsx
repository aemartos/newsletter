import { CSSProperties } from 'react';
import styles from './styles.module.css';

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  center?: boolean;
  wrapperStyle?: CSSProperties;
}

export const Spinner = ({
  size = 'medium',
  center = false,
  wrapperStyle = {},
}: SpinnerProps) => {
  const sizeStyle = {
    small: {
      width: '20px',
      height: '20px',
    },
    medium: {
      width: '40px',
      height: '40px',
    },
    large: {
      width: '80px',
      height: '80px',
    },
  };
  const borderSize = {
    small: '2px',
    medium: '4px',
    large: '8px',
  };

  return (
    <div className={styles.wrapper} style={wrapperStyle}>
      <span
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          ...(center ? { width: '100vw', height: '100vh' } : {}),
        }}
      >
        <span
          className={styles.spinner}
          style={{ borderWidth: borderSize[size], ...sizeStyle[size] }}
        />
      </span>
    </div>
  );
};
