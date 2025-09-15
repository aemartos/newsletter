import styles from './styles.module.css';

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
}

export const Spinner = ({ size = 'large' }: SpinnerProps) => {
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
      width: '100%',
      height: '100%',
    },
  };
  const borderSize = {
    small: '2px',
    medium: '4px',
    large: '8px',
  };

  return (
    <span
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        ...sizeStyle[size],
      }}
    >
      <span
        className={styles.spinner}
        style={{ borderWidth: borderSize[size] }}
      />
    </span>
  );
};
