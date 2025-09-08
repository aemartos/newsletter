import styles from './styles.module.css';

export const Spinner = () => {
  return (
    <span
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
      }}
    >
      <span className={styles.spinner} />
    </span>
  );
};
