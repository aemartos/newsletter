import { Link } from 'react-router';
import styles from './styles.module.css';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  kind?: 'dark' | 'inverted' | 'inverted-dark' | 'default';
  text: string;
  to?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
  onClick?: () => void;
}

export const Button = ({
  type = 'button',
  kind = 'default',
  text,
  to,
  disabled,
  style,
  className = '',
  onClick,
}: ButtonProps) => {
  if (to) {
    return (
      <Link
        to={to}
        className={`${styles.button} ${kind ? styles[kind] : ''} ${className}`}
        style={style}
      >
        {text}
      </Link>
    );
  }

  return (
    <button
      className={`${styles.button} ${className}`}
      type={type}
      disabled={disabled}
      style={style}
      onClick={onClick}
    >
      {text}
    </button>
  );
};
