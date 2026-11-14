import { cn } from "@/lib/utils";

export interface InputProps {
  type?: string;
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  name?: string;
}

export function Input({ type = "text", placeholder, className, value, onChange, disabled, name }: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={cn(
        "appearance-none rounded-md border border-[var(--color-olive-dark)] bg-[var(--color-white)] text-[var(--color-olive-dark)] placeholder-text-[var(--color-olive-dark)] transition-colors outline-none focus:border-[var(--color-sage-green)] focus:ring-2 focus:ring-[var(--color-sage-green)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed block w-full py-2.5 px-3",
        className
      )}
      value={value}
      onChange={onChange}
      disabled={disabled}
      name={name}
    />
  );
}