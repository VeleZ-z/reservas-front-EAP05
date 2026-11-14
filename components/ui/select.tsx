import { cn } from "@/lib/utils";

export interface SelectProps {
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  options?: { value: string; label: string }[];
  className?: string;
}

export function Select({ onValueChange, defaultValue, options, className }: SelectProps) {
  return (
    <div className={cn(
      "relative w-full",
      className
    )}>
      <select
        onChange={(e) => onValueChange?.(e.target.value)}
        value={defaultValue}
        className={cn(
          "appearance-none rounded-md border border-[var(--color-olive-dark)] bg-[var(--color-white)] text-[var(--color-olive-dark)] py-2.5 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-green)] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed block w-full",
          className
        )}
      >
        {options?.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg 
          className="w-4 h-4 text-[var(--color-olive-dark)]"
          fill="none" 
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path 
            className="stroke-[var(--color-olive-dark)]"
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M6 9l6 6 6-6"
          />
        </svg>
      </div>
    </div>
  );
}