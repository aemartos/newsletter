import { Link } from 'react-router';
import styles from './styles.module.css';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  kind?: 'dark' | 'inverted' | 'inverted-dark' | 'default';
  text: string;
  disabled?: boolean;
  style?: React.CSSProperties;
  to?: string;
  onClick?: () => void;
}

export const Button = ({
  type = 'button',
  kind = 'default',
  text,
  disabled,
  style,
  to,
  onClick,
}: ButtonProps) => {
  if (to) {
    return (
      <Link
        to={to}
        className={`${styles.button} ${kind ? styles[kind] : ''}`}
        style={style}
      >
        {text}
      </Link>
    );
  }

  return (
    <button
      className={styles.button}
      type={type}
      disabled={disabled}
      style={style}
      onClick={onClick}
    >
      {text}
    </button>
  );
};
