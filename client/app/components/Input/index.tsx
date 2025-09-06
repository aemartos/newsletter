import styles from './styles.module.css';

interface InputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'type' | 'onChange'
  > {
  type: React.HTMLInputTypeAttribute | 'text-area';
  label?: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

export const Input = ({ type, label, onChange, ...props }: InputProps) => {
  let element = (
    <input
      className={styles.input}
      type={type}
      onChange={onChange}
      {...props}
    />
  );
  if (type === 'text-area') {
    element = (
      <textarea
        className={`${styles.input} ${styles.textarea}`}
        onChange={onChange}
        rows={2}
        {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
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
};
