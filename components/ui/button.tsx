import { cn } from "@/lib/utils";

export interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  type?: "submit" | "reset";
  size?: "sm" | "md" | "lg";
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function Button({ children, variant = "primary", type = "submit", size, className, style, onClick }: ButtonProps) {
  const variants = {
    primary: "bg-[var(--color-sage-green)] text-white hover:bg-[var(--color-bronze)]",
    secondary: "bg-[var(--color-olive-dark)] text-white hover:bg-[#5a6d53]",
    ghost: "bg-transparent text-[var(--color-olive-dark)] hover:bg-[var(--color-light-turquoise)]",
  };

  const sizeClass = size 
    ? size === "sm" 
      ? "text-sm py-1 px-2" 
      : size === "lg" 
        ? "text-lg py-3 px-6" 
        : ""
    : "";

  return (
    <button
      type={type}
      className={cn(
        "px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-green)] focus:ring-offset-2",
        sizeClass,
        variants[variant],
        className
      )}
      style={style}
      onClick={onClick}
    >
      {children}
    </button>
  );
}