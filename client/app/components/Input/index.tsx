import styles from './styles.module.css';

interface InputProps {
  type: string;
  placeholder?: string;
  value?: string;
  name?: string;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  style?: React.CSSProperties;
}

export const Input = ({
  type,
  placeholder,
  value,
  name,
  required,
  onChange,
  style,
}: InputProps) => {
  return (
    <input
      className={styles.input}
      type={type}
      placeholder={placeholder}
      value={value}
      name={name}
      required={required}
      onChange={onChange}
      style={style}
    />
  );
};
