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
        "input",
        "appearance-none",
        "rounded-md",
        "border",
        "border-[var(--color-olive-dark)]",
        "bg-white",
        "text-[var(--color-olive-dark)]",
        "placeholder-text-[var(--color-olive-dark)]",
        "focus:outline-none",
        "focus:ring-2",
        "focus:ring-[var(--color-sage-green)]",
        "focus:border-transparent",
        "disabled:opacity-50",
        "disabled:cursor-not-allowed",
        className
      )}
      value={value}
      onChange={onChange}
      disabled={disabled}
      name={name}
    />
  );
}