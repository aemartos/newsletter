import { CSSProperties } from 'react';
import styles from './styles.module.css';

interface HeaderProps {
  title: string;
  description?: string;
  style?: CSSProperties;
}

export const Header = ({ title, description, style }: HeaderProps) => {
  return (
    <div className={styles.header} style={style}>
      <h1>{title}</h1>
      {description && <span>{description}</span>}
    </div>
  );
};
