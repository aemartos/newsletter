import { forwardRef, RefObject } from 'react';
import styles from './styles.module.css';

type InputProps = React.ComponentPropsWithoutRef<'input'> & {
  type: React.HTMLInputTypeAttribute | 'text-area';
  label?: string;
};

export const Input = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  InputProps
>(({ type, label, ...props }, ref) => {
  let element = (
    <input
      ref={ref as RefObject<HTMLInputElement>}
      className={styles.input}
      type={type}
      {...props}
    />
  );

  if (type === 'text-area') {
    element = (
      <textarea
        ref={ref as RefObject<HTMLTextAreaElement>}
        className={`${styles.input} ${styles.textarea}`}
        rows={2}
        {...(props as React.ComponentPropsWithoutRef<'textarea'>)}
      />
    );
  }

  return (
    <div className={styles['input-container']}>
      {label && (
        <label className={styles.label} htmlFor={props.name}>
          {label} {props.required && <span className={styles.required}>*</span>}
        </label>
      )}
      {element}
    </div>
  );
});

Input.displayName = 'Input';
