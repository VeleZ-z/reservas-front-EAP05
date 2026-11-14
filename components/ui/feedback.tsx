import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("skeleton h-4 w-full", className)} aria-hidden="true" {...props} />;
}

/** Filas fantasma para tablas mientras carga la data (loading-states skill) */
export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="w-full space-y-2 p-4" role="status" aria-label="Cargando contenido">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4">
          {Array.from({ length: cols }).map((__, c) => (
            <Skeleton key={c} className="h-9 flex-1" />
          ))}
        </div>
      ))}
      <span className="sr-only">Cargando…</span>
    </div>
  );
}

/** Estado vacío con icono, título y acción (aesthetic-usability skill) */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("empty-state", className)}>
      {icon ? (
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
          {icon}
        </div>
      ) : null}
      <div className="flex flex-col gap-1">
        <p className="text-title-md text-ink">{title}</p>
        {description ? <p className="max-w-sm text-body-sm text-ink-muted">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
