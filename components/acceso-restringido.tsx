import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/feedback";

/**
 * Estados de acceso restringido para las vistas internas.
 * Se usa en lugar de dejar la página en blanco cuando el usuario no tiene
 * sesión o su rol no corresponde.
 */

const iconoBloqueo = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-6"
  >
    <rect width="18" height="11" x="3" y="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

export function RequiereSesion({
  descripcion,
}: {
  descripcion: string;
}) {
  return (
    <Card className="animate-fade-in">
      <EmptyState
        icon={iconoBloqueo}
        title="Inicia sesión para continuar"
        description={descripcion}
        action={
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/login">
              <Button variant="primary">Iniciar sesión</Button>
            </Link>
            <Link href="/registro">
              <Button variant="outline">Crear cuenta</Button>
            </Link>
          </div>
        }
      />
    </Card>
  );
}

export function RolNoPermitido({
  rolActual,
  rolRequerido,
  descripcion,
}: {
  rolActual: string;
  rolRequerido: string;
  descripcion: string;
}) {
  return (
    <Card className="animate-fade-in">
      <EmptyState
        icon={iconoBloqueo}
        title={`Esta sección es para el rol ${rolRequerido}`}
        description={`${descripcion} Tu cuenta está registrada como ${rolActual}.`}
        action={
          <Link href="/">
            <Button variant="outline">Volver al panel</Button>
          </Link>
        }
      />
    </Card>
  );
}
