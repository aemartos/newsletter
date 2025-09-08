import { ReactNode } from 'react';
import { Menu } from '../Menu';
import styles from './styles.module.css';

interface LayoutProps {
  centered?: boolean;
  showMenu?: boolean;
  children: ReactNode;
}

export const Layout = ({
  children,
  centered = false,
  showMenu = true,
}: LayoutProps) => {
  return (
    <div
      className={`${styles['main-wrapper']} ${centered ? styles.centered : ''} ${showMenu ? styles.showMenu : ''}`}
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
