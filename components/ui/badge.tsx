import { cn } from "@/lib/utils";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error";
  className?: string;
}

export function Badge({ variant = "default", className, children }: BadgeProps) {
  const variants = {
    default: "text-[var(--color-olive-dark)] bg-[var(--color-light-turquoise)]",
    success: "text-[var(--color-sage-green)] bg-success",
    warning: "text-[var(--color-bronze)] bg-warning",
    error: "text-white bg-error",
  };

  return (
    <span 
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}