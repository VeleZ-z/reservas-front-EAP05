import { cn } from "@/lib/utils";

export interface CardProps {
  className?: string;
  children: React.ReactNode;
  header?: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function Card({ className, children, header, title, subtitle }: CardProps) {
  return (
    <div 
      className={cn(
        "bg-[var(--color-white)] border border-[var(--color-olive-dark)] rounded-2xl shadow-sm hover:shadow-md transition-all",
        "dark:bg-[var(--color-olive-dark)] dark:text-[var(--color-light-turquoise)]",
        "className"
      )}
    >
      {header || title || subtitle ? (
        <div className="px-6 py-4 border-b border-b-[var(--color-olive-dark)]">
          {title && <h3 className="text-xl font-medium text-[var(--color-olive-dark)]">{title}</h3>}
          {subtitle && <p className="text-sm text-[var(--color-olive-dark)]/60">{subtitle}</p>}
          {header && <div>{header}</div>}
        </div>
      ) : null}
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}