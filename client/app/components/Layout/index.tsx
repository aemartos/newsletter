import { Menu } from '../Menu';
import styles from './styles.module.css';

interface LayoutProps {
  centered?: boolean;
  showMenu?: boolean;
  children: React.ReactNode;
}

export const Layout = ({
  children,
  centered = false,
  showMenu = true,
}: LayoutProps) => {
  return (
    <div
      className={`${styles.container} ${centered ? styles.centered : ''} ${showMenu ? styles.showMenu : ''}`}
    >
      {showMenu && (
        <Menu
          items={[
            { text: 'create', href: '/' },
            { text: 'subscribe', href: '/subscribe' },
          ]}
        />
      )}
      {children}
    </div>
  );
};
