import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export function Input({ className, type = "text", invalid, ...props }: InputProps) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-md border bg-surface px-3 py-2",
        "text-body text-ink placeholder:text-ink-subtle",
        "transition-colors duration-fast",
        "focus-ring",
        "disabled:cursor-not-allowed disabled:bg-surface-subtle disabled:opacity-60",
        "read-only:bg-surface-subtle",
        invalid
          ? "border-error focus-visible:border-error"
          : "border-line-strong hover:border-moss-400",
        className
      )}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
}
