"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/feedback";
import { consultarAgenda, type AgendaItem } from "@/src/api/agenda";
import { getSesion, type Sesion } from "@/src/api/sesion";

/* ------------------------------------------------------------------ */
/*  Estado sin sesión: hero de bienvenida                             */
/* ------------------------------------------------------------------ */

function Bienvenida() {
  const capacidades = [
    {
      titulo: "Reserva en segundos",
      texto:
        "Elige servicio y horario; el servidor valida la disponibilidad y evita sobrecupos.",
      icon: (
        <>
          <path d="M8 2v4M16 2v4" />
          <rect width="18" height="18" x="3" y="4" rx="2" />
          <path d="m9 14 2 2 4-4" />
        </>
      ),
    },
    {
      titulo: "Controla tu disponibilidad",
      texto:
        "Publica bloques horarios y bloquéalos cuando ya no estén disponibles.",
      icon: (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </>
      ),
    },
    {
      titulo: "Un catálogo, muchas agendas",
      texto:
        "Servicios, recursos y duraciones se definen una vez y se reutilizan.",
      icon: (
        <>
          <path d="M4 7V4h16v3M9 20h6M12 4v16" />
        </>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-brand-gradient p-8 text-white shadow-lg sm:p-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 82% 18%, rgba(255,255,255,0.6) 0, transparent 44%), radial-gradient(circle at 12% 88%, rgba(255,255,255,0.35) 0, transparent 46%)",
          }}
        />
        <div className="relative flex max-w-3xl flex-col gap-6">
          <Badge variant="inverse" className="w-fit">
            Sistema de reservas · 
          </Badge>
          <div className="flex flex-col gap-3">
            <h1 className="text-heading-md text-white sm:text-heading-lg">
              Organiza tus citas sin llamadas ni cuadernos
            </h1>
            <p className="text-body-lg text-white/80">
              Agenda servicios, controla la disponibilidad de tus recursos y
              lleva el histórico de reservas en un solo panel.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/login">
              <Button size="lg" variant="inverse">
                Iniciar sesión
              </Button>
            </Link>
            <Link href="/registro">
              <Button
                size="lg"
                variant="outline"
                className="border-white/40 bg-transparent text-white hover:border-white hover:bg-white/10"
              >
                Crear cuenta de cliente
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Capacidades */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {capacidades.map((c) => (
          <Card key={c.titulo} className="flex flex-col gap-3 p-6">
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-5"
              >
                {c.icon}
              </svg>
            </span>
            <div className="flex flex-col gap-1">
              <p className="text-title-sm text-ink">{c.titulo}</p>
              <p className="text-body-sm text-ink-muted">{c.texto}</p>
            </div>
          </Card>
        ))}
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Estado con sesión: KPIs + actividad                                */
/* ------------------------------------------------------------------ */

interface Stat {
  label: string;
  value: string;
  hint: string;
  tone: "primary" | "accent" | "info" | "warning";
  icon: React.ReactNode;
}

const STAT_ICONS = {
  reservas: (
    <>
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </>
  ),
  pendientes: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  canceladas: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15 9-6 6M9 9l6 6" />
    </>
  ),
  ocupacion: (
    <>
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </>
  ),
  servicios: (
    <>
      <path d="M4 7V4h16v3M9 20h6M12 4v16" />
    </>
  ),
  equipo: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    </>
  ),
} as const;

function StatCard({ stat, cargando }: { stat: Stat; cargando: boolean }) {
  const tones = {
    primary: "bg-primary-soft text-primary",
    accent: "bg-accent-soft text-accent-text",
    info: "bg-info-soft text-info-text",
    warning: "bg-warning-soft text-warning-text",
  };

  return (
    <Card className="flex flex-col gap-4 p-6">
      <div className="flex items-start justify-between gap-3">
        <p className="text-body-sm font-medium text-ink-muted">{stat.label}</p>
        <span
          className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${tones[stat.tone]}`}
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
            {stat.icon}
          </svg>
        </span>
      </div>
      <div className="flex flex-col gap-1">
        {cargando ? (
          <Skeleton className="h-9 w-20" />
        ) : (
          <p className="text-heading-lg leading-none text-ink">{stat.value}</p>
        )}
        <p className="text-caption text-ink-subtle">{stat.hint}</p>
      </div>
    </Card>
  );
}

function PanelSesion({ sesion }: { sesion: Sesion }) {
  const [agenda, setAgenda] = useState<AgendaItem[] | null>(null);
  const [cargando, setCargando] = useState(false);

  // La agenda solo existe para el rol PROVEEDOR.
  const esProveedor = sesion.rol === "proveedor";

  useEffect(() => {
    if (!esProveedor) return;
    setCargando(true);
    consultarAgenda()
      .then(setAgenda)
      .catch(() => setAgenda([]))
      .finally(() => setCargando(false));
  }, [esProveedor]);

  const total = agenda?.length ?? 0;
  const canceladas = agenda?.filter((a) => a.estado === "CANCELADA").length ?? 0;
  const activas = total - canceladas;
  const ocupacion = total ? Math.round((activas / total) * 100) : 0;

  const stats: Stat[] = esProveedor
    ? [
        {
          label: "Reservas recibidas",
          value: String(total),
          hint: "Total en tu agenda",
          tone: "primary",
          icon: STAT_ICONS.reservas,
        },
        {
          label: "Activas",
          value: String(activas),
          hint: "Confirmadas o pendientes",
          tone: "accent",
          icon: STAT_ICONS.pendientes,
        },
        {
          label: "Canceladas",
          value: String(canceladas),
          hint: "Histórico de cancelaciones",
          tone: "warning",
          icon: STAT_ICONS.canceladas,
        },
        {
          label: "Ocupación",
          value: `${ocupacion}%`,
          hint: "Reservas sobre el total",
          tone: "info",
          icon: STAT_ICONS.ocupacion,
        },
      ]
    : [
        {
          label: "Rol activo",
          value:
            sesion.rol === "administrador" ? "Admin" : "Cliente",
          hint: "Permisos activos en tu cuenta",
          tone: "primary",
          icon: STAT_ICONS.equipo,
        },
        {
          label: "Servicios",
          value: "—",
          hint: "Consulta el catálogo disponible",
          tone: "accent",
          icon: STAT_ICONS.servicios,
        },
        {
          label: "Reservas",
          value: "—",
          hint: "Crea tu primera reserva",
          tone: "info",
          icon: STAT_ICONS.reservas,
        },
        {
          label: "Horarios",
          value: "—",
          hint: "Disponibilidad publicada",
          tone: "warning",
          icon: STAT_ICONS.pendientes,
        },
      ];

  const recientes = agenda?.slice(0, 5) ?? [];

  return (
    <>
      <PageHeader
        eyebrow="Panel de control"
        title={`Hola, ${sesion.usuario.split("@")[0]}`}
        description={
          esProveedor
            ? "Este es el estado de las reservas que has recibido."
            : "Gestiona tus reservas y la disponibilidad de tu negocio."
        }
        actions={
          <Link href={esProveedor ? "/horarios" : "/reservas"}>
            <Button variant="primary">
              {esProveedor ? "Publicar horario" : "Nueva reserva"}
            </Button>
          </Link>
        }
      />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <StatCard
            key={s.label}
            stat={s}
            cargando={esProveedor && cargando}
          />
        ))}
      </section>

      <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between border-b border-line p-6 pb-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-title-md text-ink">
                {esProveedor ? "Reservas recientes" : "Actividad reciente"}
              </h2>
              <p className="text-body-sm text-ink-muted">
                {esProveedor
                  ? "Últimas 5 operaciones registradas"
                  : "Tus últimas reservas realizadas"}
              </p>
            </div>
            {esProveedor ? (
              <Link href="/agenda">
                <Button variant="ghost" size="sm">
                  Ver todas
                </Button>
              </Link>
            ) : null}
          </div>

          {!esProveedor ? (
            <div className="empty-state p-12">
              <span className="flex size-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-6"
                >
                  <rect width="18" height="18" x="3" y="4" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
              </span>
              <div className="flex flex-col gap-1">
                <p className="text-title-md text-ink">Aún no tienes reservas</p>
                <p className="max-w-sm text-body-sm text-ink-muted">
                  Crea tu primera reserva seleccionando un servicio y un horario
                  disponible.
                </p>
              </div>
              <Link href="/reservas">
                <Button variant="primary">Crear reserva</Button>
              </Link>
            </div>
          ) : agenda === null ? (
            <div className="space-y-3 p-6">
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          ) : recientes.length === 0 ? (
            <div className="empty-state p-12">
              <span className="flex size-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-6"
                >
                  <rect width="18" height="18" x="3" y="4" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
              </span>
              <div className="flex flex-col gap-1">
                <p className="text-title-md text-ink">Sin reservas por ahora</p>
                <p className="max-w-sm text-body-sm text-ink-muted">
                  Publica tus horarios para que los clientes puedan agendarte.
                </p>
              </div>
              <Link href="/horarios">
                <Button variant="primary">Publicar horario</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th scope="col">Servicio</th>
                    <th scope="col">Cliente</th>
                    <th scope="col">Estado</th>
                    <th scope="col">Creada</th>
                  </tr>
                </thead>
                <tbody>
                  {recientes.map((r) => (
                    <tr key={r.id}>
                      <td className="font-mono text-caption text-ink">
                        {r.servicioId?.slice(0, 8)}
                      </td>
                      <td className="font-mono text-caption">
                        {r.clienteId?.slice(0, 8)}
                      </td>
                      <td>
                        <Badge
                          variant={
                            r.estado === "CANCELADA"
                              ? "danger"
                              : r.estado === "CONFIRMADA"
                                ? "success"
                                : "warning"
                          }
                          dot
                        >
                          {r.estado}
                        </Badge>
                      </td>
                      <td className="text-caption">
                        {new Date(r.creadaEn).toLocaleString("es-CO", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card>
          <div className="border-b border-line p-6 pb-4">
            <h2 className="text-title-md text-ink">Acciones rápidas</h2>
            <p className="text-body-sm text-ink-muted">
              Atajos a las tareas más frecuentes
            </p>
          </div>
          <div className="flex flex-col gap-1 p-4">
            {(
              esProveedor
                ? [
                    {
                      href: "/horarios",
                      label: "Publicar horario",
                      desc: "Define un bloque disponible",
                      icon: STAT_ICONS.pendientes,
                    },
                    {
                      href: "/agenda",
                      label: "Ver agenda",
                      desc: "Reservas y estados",
                      icon: STAT_ICONS.reservas,
                    },
                  ]
                : [
                    {
                      href: "/reservas",
                      label: "Crear reserva",
                      desc: "Agenda un nuevo servicio",
                      icon: STAT_ICONS.reservas,
                    },
                    {
                      href: "/servicios",
                      label: "Catálogo",
                      desc: "Servicios y recursos",
                      icon: STAT_ICONS.servicios,
                    },
                  ]
            ).map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="group flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-surface-subtle"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary-soft text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-[18px]"
                  >
                    {a.icon}
                  </svg>
                </span>
                <span className="flex min-w-0 flex-col leading-tight">
                  <span className="text-body-sm font-semibold text-ink">
                    {a.label}
                  </span>
                  <span className="truncate text-caption text-ink-subtle">
                    {a.desc}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </Card>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */

export default function HomePage() {
  const [sesion, setSesion] = useState<Sesion | null>(null);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    setSesion(getSesion());
    setListo(true);
    const onChange = () => setSesion(getSesion());
    window.addEventListener("sesion:cambiada", onChange);
    return () => window.removeEventListener("sesion:cambiada", onChange);
  }, []);

  if (!listo) {
    return (
      <div className="flex flex-col gap-8">
        <Skeleton className="h-10 w-72" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return sesion ? <PanelSesion sesion={sesion} /> : <Bienvenida />;
}
