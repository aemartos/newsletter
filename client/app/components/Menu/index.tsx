import { Link } from 'react-router';
import styles from './styles.module.css';

interface MenuProps {
  items: { text: string; href: string }[];
  style?: React.CSSProperties;
}

export const Menu = ({ items, style }: MenuProps) => {
  return (
    <div className={styles.menu} style={style}>
      {items.map(item => (
        <Link to={item.href} className={styles.item} key={item.text}>
          {item.text}
        </Link>
      ))}
    </div>
  );
};
