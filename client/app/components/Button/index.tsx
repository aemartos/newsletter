import { CSSProperties } from 'react';
import { Link } from 'react-router';
import styles from './styles.module.css';
import { Spinner } from '../Spinner';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  kind?: 'dark' | 'inverted' | 'inverted-dark' | 'default';
  text: string;
  to?: string;
  disabled?: boolean;
  loading?: boolean;
  style?: CSSProperties;
  className?: string;
  onClick?: () => void;
}

export const Button = ({
  type = 'button',
  kind = 'default',
  text,
  to,
  disabled,
  loading,
  style,
  className = '',
  onClick,
}: ButtonProps) => {
  if (to) {
    return (
      <Link
        to={disabled ? undefined : to}
        className={`${styles.button} ${kind ? styles[kind] : ''} ${className} ${disabled ? styles.disabled : ''}`}
        style={style}
        disabled={disabled}
      >
        {loading ? <Spinner size="small" /> : text}
      </Link>
    );
  }
  return (
    <button
      className={`${styles.button} ${className} ${disabled ? styles.disabled : ''}`}
      type={type}
      disabled={disabled}
      style={style}
      onClick={disabled ? undefined : onClick}
    >
      {loading ? <Spinner size="small" /> : text}
    </button>
  );
};
