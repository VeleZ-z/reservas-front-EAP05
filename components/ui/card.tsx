import { cn } from "@/lib/utils";

export interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export function Card({ className, children }: CardProps) {
  return (
    <div 
      className={cn(
        "bg-white rounded-lg shadow-sm border border-[var(--color-olive-dark)]",
        "dark:bg-[var(--color-olive-dark)] dark:text-[var(--color-light-turquoise)]",
        "className"
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="px-6 py-5 border-b border-b-[var(--color-olive-dark)] flex items-start justify-between"><span>{children}</span></div>;
}

export function CardTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-xl font-medium text-[var(--color-olive-dark)]">{children}</h3>;
}

export function CardContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("px-6 py-5", className)}>{children}</div>;
}