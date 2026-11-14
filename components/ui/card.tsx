import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Elevación y hover según jerarquía visual */
  interactive?: boolean;
  /** Contraste invertido para superficies de marca */
  inverse?: boolean;
}

export function Card({
  className,
  interactive = false,
  inverse = false,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border",
        inverse
          ? "border-transparent bg-surface-inverse text-ink-inverse"
          : "border-line bg-surface text-ink shadow-sm",
        interactive && "surface-card-hover cursor-pointer",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1 p-6 pb-4", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-title-md text-ink", className)} {...props} />;
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-body-sm text-ink-muted", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center gap-3 border-t border-line p-6 pt-4", className)} {...props} />
  );
}
