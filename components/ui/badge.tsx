import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "inverse";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  /** Punto de estado: nuncaUses color solo (WCAG) */
  dot?: boolean;
}

export function Badge({ className, variant = "neutral", dot, children, ...props }: BadgeProps) {
  const variants: Record<BadgeVariant, string> = {
    neutral: "bg-surface-subtle text-ink-muted border-line",
    primary: "bg-primary-soft text-ink-brand border-moss-200",
    success: "bg-success-soft text-success-text border-sage-200",
    warning: "bg-warning-soft text-warning-text border-bronze-200",
    danger: "bg-error-soft text-error-text border-red-200",
    info: "bg-info-soft text-info-text border-turquoise-200",
    inverse: "border-white/25 bg-white/15 text-white backdrop-blur",
  };

  const dots: Record<BadgeVariant, string> = {
    neutral: "bg-ink-subtle",
    primary: "bg-primary",
    success: "bg-success",
    warning: "bg-warning",
    danger: "bg-error",
    info: "bg-info",
    inverse: "bg-white",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill border px-2.5 py-0.5",
        "text-caption font-semibold",
        variants[variant],
        className
      )}
      {...props}
    >
      {dot ? (
        <span className={cn("size-1.5 rounded-full", dots[variant])} aria-hidden="true" />
      ) : null}
      {children}
    </span>
  );
}
