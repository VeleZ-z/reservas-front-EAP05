import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  options?: SelectOption[];
  placeholder?: string;
  onValueChange?: (value: string) => void;
  invalid?: boolean;
}

export function Select({
  className,
  options = [],
  placeholder,
  onValueChange,
  invalid,
  ...props
}: SelectProps) {
  return (
    <div className="relative w-full">
      <select
        className={cn(
          "flex h-11 w-full appearance-none rounded-md border bg-surface px-3 py-2 pr-10",
          "text-body text-ink transition-colors duration-fast",
          "focus-ring",
          "disabled:cursor-not-allowed disabled:bg-surface-subtle disabled:opacity-60",
          invalid ? "border-error" : "border-line-strong hover:border-moss-400",
          className
        )}
        onChange={(e) => onValueChange?.(e.target.value)}
        {...props}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink-subtle"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  );
}
