import { cn } from "@/lib/utils";

export interface ButtonProps {
  children: React.ReactNode;
  variant?: "default" | "primary" | "secondary" | "destructive" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  style?: React.CSSProperties;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

export function Button({ 
  children, 
  variant = "primary", 
  size = "default", 
  className, 
  style,
  type = "button",
  onClick 
}: ButtonProps) {
  const variants = {
    default: "bg-transparent text-text hover:bg-accent",
    primary: "bg-[var(--color-sage-green)] text-white hover:bg-[var(--color-bronze)]",
    secondary: "bg-[var(--color-olive-dark)] text-white hover:bg-[#5a6d53]",
    destructive: "bg-[var(--color-bronze)] text-white hover:bg-[#b45326]",
    outline: "border border-[var(--color-olive-dark)] text-[var(--color-olive-dark)] hover:bg-[var(--color-light-turquoise)]",
    ghost: "bg-transparent text-[var(--color-olive-dark)] hover:bg-[var(--color-light-turquoise)]",
  };

  const sizeStyles = {
    default: "py-2 px-4",
    sm: "py-1.5 px-3 text-sm",
    lg: "py-3 px-6 text-lg",
    icon: "p-1",
  };

  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizeStyles[size],
        className
      )}
      style={style}
      onClick={onClick}
    >
      {children}
    </button>
  );
}