import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive"
  | "accent";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

/**
 * Button — Tier 3 component tokens.
 * Un solo peso visual por jerarquía: primary es la única acción dominante
 * por vista (regla visual-hierarchy).
 */
export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-primary text-ink-inverse shadow-xs hover:bg-primary-hover active:bg-primary-active",
    secondary:
      "bg-ink text-ink-inverse shadow-xs hover:bg-neutral-800 active:bg-neutral-900",
    accent:
      "bg-accent text-white shadow-xs hover:bg-accent-hover active:bg-sage-700",
    outline:
      "border border-line-strong bg-surface text-ink hover:bg-surface-subtle hover:border-primary",
    ghost:
      "text-ink-muted hover:bg-surface-subtle hover:text-ink",
    destructive:
      "bg-error text-white shadow-xs hover:brightness-95 active:brightness-90",
  };

  const sizes: Record<ButtonSize, string> = {
    sm: "h-8 px-3 text-body-sm gap-1.5",
    md: "h-10 px-4 text-body-sm gap-2",
    lg: "h-12 px-6 text-body gap-2",
  };

  return (
    <button
      type={type}
      className={cn(
        "inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-md",
        "font-semibold transition-all duration-fast ease-out select-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
        "disabled:pointer-events-none disabled:opacity-50",
        "[&_svg]:size-4 [&_svg]:shrink-0",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
