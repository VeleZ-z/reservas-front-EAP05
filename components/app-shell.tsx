"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { getSesion, clearSesion, type Sesion, type Rol } from "@/src/api/sesion";
import { logout } from "@/src/api/auth";

interface NavItem {
  href: string;
  label: string;
  description: string;
  roles: Rol[];
  icon: React.ReactNode;
}

const icon = (path: React.ReactNode) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-[18px]"
  >
    {path}
  </svg>
);

const NAV: NavItem[] = [
  {
    href: "/",
    label: "Panel",
    description: "Resumen general",
    roles: ["cliente", "proveedor", "administrador"],
    icon: icon(
      <>
        <rect width="7" height="9" x="3" y="3" rx="1" />
        <rect width="7" height="5" x="14" y="3" rx="1" />
        <rect width="7" height="9" x="14" y="12" rx="1" />
        <rect width="7" height="5" x="3" y="16" rx="1" />
      </>
    ),
  },
  {
    href: "/agenda",
    label: "Agenda",
    description: "Reservas recibidas",
    roles: ["proveedor"],
    icon: icon(
      <>
        <rect width="18" height="18" x="3" y="4" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </>
    ),
  },
  {
    href: "/horarios",
    label: "Horarios",
    description: "Publica tu disponibilidad",
    roles: ["proveedor"],
    icon: icon(
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
  },
  {
    href: "/historial-proveedor",
    label: "Historial",
    description: "Reservas de tus servicios",
    roles: ["proveedor"],
    icon: icon(
      <>
        <path d="M3 3v18h18" />
        <path d="M18 17V9M13 17V5M8 17v-3" />
      </>
    ),
  },
  {
    href: "/servicios",
    label: "Servicios",
    description: "Catálogo y recursos",
    roles: ["administrador"],
    icon: icon(
      <>
        <path d="M4 7V4h16v3M9 20h6M12 4v16" />
      </>
    ),
  },
  {
    href: "/eventos",
    label: "Eventos",
    description: "Ocupación y gestión",
    roles: ["administrador"],
    icon: icon(
      <>
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
      </>
    ),
  },
  {
    href: "/servicios/uso",
    label: "Uso de servicios",
    description: "Reservas por servicio",
    roles: ["administrador"],
    icon: icon(
      <>
        <path d="M3 3v18h18" />
        <path d="M18 17V9M13 17V5M8 17v-3" />
      </>
    ),
  },
  {
    href: "/servicios/ocupacion",
    label: "Ocupación",
    description: "Horarios reservados",
    roles: ["administrador"],
    icon: icon(
      <>
        <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
        <path d="M22 12A10 10 0 0 0 12 2v10z" />
      </>
    ),
  },
  {
    href: "/historial-negocio",
    label: "Historial del negocio",
    description: "Servicios y eventos",
    roles: ["administrador"],
    icon: icon(
      <>
        <path d="M3 21h18M5 21V7l7-4 7 4v14" />
        <path d="M9 21v-6h6v6" />
      </>
    ),
  },
  {
    href: "/reservas",
    label: "Reservas",
    description: "Crea y cancela",
    roles: ["cliente"],
    icon: icon(
      <>
        <path d="M8 2v4M16 2v4" />
        <rect width="18" height="18" x="3" y="4" rx="2" />
        <path d="m9 14 2 2 4-4" />
      </>
    ),
  },
  {
    href: "/servicios/disponibilidad",
    label: "Disponibilidad",
    description: "Horarios libres",
    roles: ["cliente"],
    icon: icon(
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
  },
  {
    href: "/eventos/reservar",
    label: "Eventos",
    description: "Reserva tu cupo",
    roles: ["cliente"],
    icon: icon(
      <>
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
      </>
    ),
  },
  {
    href: "/historial",
    label: "Historial",
    description: "Mis reservas",
    roles: ["cliente"],
    icon: icon(
      <>
        <rect width="18" height="18" x="3" y="4" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </>
    ),
  },
];

const ROL_LABEL: Record<Rol, string> = {
  cliente: "Cliente",
  proveedor: "Proveedor",
  administrador: "Administrador",
};

function initials(email: string): string {
  const local = email.split("@")[0] || "?";
  const parts = local.split(/[._-]/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return local.slice(0, 2).toUpperCase();
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [sesion, setSesion] = useState<Sesion | null>(null);

  const leerSesion = useCallback(() => setSesion(getSesion()), []);

  useEffect(() => {
    setMounted(true);
    leerSesion();
    // Se sincroniza al iniciar sesión, cerrarla o en otra pestaña.
    window.addEventListener("sesion:cambiada", leerSesion);
    window.addEventListener("storage", leerSesion);
    return () => {
      window.removeEventListener("sesion:cambiada", leerSesion);
      window.removeEventListener("storage", leerSesion);
    };
  }, [leerSesion]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Sin sesión mostramos todo el catálogo; con sesión, solo lo permitido.
  const visibleNav = sesion
    ? NAV.filter((n) => n.roles.includes(sesion.rol))
    : NAV;

  async function handleLogout() {
    try {
      await logout();
    } catch {
      // El token se limpia igual en el `finally` de logout().
    }
    clearSesion();
    window.location.href = "/login";
  }

  return (
    <div className="min-h-screen bg-canvas">
      {/* ============ SIDEBAR (desktop) ============ */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] flex-col border-r border-line bg-surface lg:flex">
        <div className="flex h-16 items-center gap-3 border-b border-line px-6">
          <div className="flex size-9 items-center justify-center rounded-lg bg-brand-gradient text-white shadow-xs">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-5"
            >
              <path d="M8 2v4M16 2v4" />
              <rect width="18" height="18" x="3" y="4" rx="2" />
              <path d="m9 14 2 2 4-4" />
            </svg>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-title-sm tracking-tight text-ink">Reserva.io</span>
            <span className="mt-0.5 text-caption text-ink-subtle">
              
            </span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          <p className="eyebrow px-3 pb-2 pt-1">Navegación</p>
          {visibleNav.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors duration-fast",
                  active
                    ? "bg-primary-soft text-ink-brand"
                    : "text-ink-muted hover:bg-surface-subtle hover:text-ink"
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md transition-colors",
                    active
                      ? "bg-primary text-white shadow-xs"
                      : "bg-surface-subtle text-ink-subtle group-hover:text-ink"
                  )}
                >
                  {item.icon}
                </span>
                <span className="flex min-w-0 flex-col leading-tight">
                  <span className="text-body-sm font-semibold">{item.label}</span>
                  <span className="truncate text-caption text-ink-subtle">
                    {item.description}
                  </span>
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Sesión */}
        <div className="border-t border-line p-4">
          {mounted && sesion ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 rounded-lg bg-surface-subtle p-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-caption font-bold text-ink-brand">
                  {initials(sesion.usuario)}
                </span>
                <span className="flex min-w-0 flex-col leading-tight">
                  <span className="truncate text-body-sm font-semibold text-ink">
                    {sesion.usuario}
                  </span>
                  <span className="text-caption text-ink-subtle">
                    {ROL_LABEL[sesion.rol]}
                  </span>
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-body-sm font-medium text-ink-muted transition-colors hover:bg-error-soft hover:text-error-text"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-[18px]"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                </svg>
                Cerrar sesión
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="rounded-lg border border-line bg-surface-subtle p-3">
                <p className="text-body-sm font-semibold text-ink">
                  ¿Primera vez aquí?
                </p>
                <p className="mt-1 text-caption text-ink-muted">
                  Crea una cuenta para agendar servicios con tus proveedores.
                </p>
                <Link
                  href="/registro"
                  className="mt-2 inline-block text-caption font-semibold text-primary hover:text-primary-hover"
                >
                  Crear cuenta de cliente
                </Link>
              </div>
              <Link
                href="/login"
                className="flex items-center gap-3 rounded-lg bg-primary px-3 py-2.5 text-body-sm font-semibold text-white shadow-xs transition-colors hover:bg-primary-hover"
              >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-[18px]"
              >
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" />
              </svg>
              Iniciar sesión
            </Link>
            </div>
          )}
        </div>
      </aside>

      {/* ============ MOBILE TOPBAR ============ */}
      <header className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur lg:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-brand-gradient text-white">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4"
              >
                <path d="M8 2v4M16 2v4" />
                <rect width="18" height="18" x="3" y="4" rx="2" />
                <path d="m9 14 2 2 4-4" />
              </svg>
            </div>
            <span className="text-title-sm text-ink">Reserva.io</span>
          </Link>

          {mounted && sesion ? (
            <span className="flex size-8 items-center justify-center rounded-full bg-primary-soft text-caption font-bold text-ink-brand">
              {initials(sesion.usuario)}
            </span>
          ) : (
            <Link
              href="/login"
              className="rounded-md bg-primary px-3 py-1.5 text-caption font-semibold text-white shadow-xs"
            >
              Entrar
            </Link>
          )}
        </div>

        {/* Navegación horizontal desplazable */}
        <nav className="scrollbar-none flex gap-1 overflow-x-auto border-t border-line px-2 py-2">
          {visibleNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-md px-3 py-1.5 text-body-sm font-medium transition-colors",
                isActive(item.href)
                  ? "bg-primary-soft text-ink-brand"
                  : "text-ink-muted hover:bg-surface-subtle"
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      {/* ============ MAIN ============ */}
      <main className="flex min-h-screen flex-col lg:pl-[260px]">
        <div className="mx-auto w-full max-w-layout flex-1 px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
        <footer className="border-t border-line">
          <div className="mx-auto flex w-full max-w-layout flex-wrap items-center justify-between gap-2 px-4 py-5 sm:px-6 lg:px-8">
            <p className="text-caption text-ink-subtle">
              Sistema de Reservas 
            </p>
            <p className="text-caption text-ink-subtle">
              Next.js + Spring Boot project 
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
