import { cn } from "@/lib/utils";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "success" | "warning" | "danger";
  title?: string;
}

export function Alert({ className, variant = "info", title, children, ...props }: AlertProps) {
  const variants = {
    info: "border-info/30 bg-info-soft text-info-text",
    success: "border-sage-300 bg-success-soft text-success-text",
    warning: "border-bronze-300 bg-warning-soft text-warning-text",
    danger: "border-red-300 bg-error-soft text-error-text",
  };

  const icons = {
    info: "M12 16v-4M12 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
    success: "m9 12 2 2 4-4M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
    warning: "M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z",
    danger: "M12 8v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  };

  return (
    <div
      role="alert"
      className={cn("flex gap-3 rounded-lg border p-4 text-body-sm", variants[variant], className)}
      {...props}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mt-0.5 size-4 shrink-0"
      >
        <path d={icons[variant]} />
      </svg>
      <div className="flex flex-col gap-1">
        {title ? <p className="font-semibold">{title}</p> : null}
        <div className="opacity-90">{children}</div>
      </div>
    </div>
  );
}
