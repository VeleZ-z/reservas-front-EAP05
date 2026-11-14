import { cn } from "@/lib/utils";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  /** Texto de ayuda bajo el campo (form-design skill) */
  hint?: string;
  /** Mensaje de error accesible (error-handling-ux skill) */
  error?: string;
}

export function Label({ className, required, hint, error, children, ...props }: LabelProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className={cn("text-body-sm font-semibold text-ink", className)}
        {...props}
      >
        {children}
        {required ? (
          <span className="ml-0.5 text-error-text" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      {hint && !error ? (
        <p className="text-caption text-ink-subtle">{hint}</p>
      ) : null}
      {error ? (
        <p role="alert" className="text-caption font-medium text-error-text">
          {error}
        </p>
      ) : null}
    </div>
  );
}
