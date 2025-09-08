import { CSSProperties } from 'react';
import styles from './styles.module.css';
import { Button } from '../Button';
import { Header } from '../Header';

interface GenericErrorProps {
  title: string;
  description?: string;
  to?: string;
  style?: CSSProperties;
}

export const GenericError = ({
  title,
  description = 'Take a look to our recent posts!',
  to,
  style,
}: GenericErrorProps) => {
  return (
    <div className={styles['generic-error']} style={style}>
      <Header title={title} description={description} />
      {to && <Button to={to} text="go!" style={{ fontWeight: '600' }} />}
    </div>
  );
};
