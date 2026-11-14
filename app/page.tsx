"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/feedback";
import { consultarAgenda, type AgendaItem } from "@/src/api/agenda";
import { getToken } from "@/src/api/config";

interface Stat {
  label: string;
  value: string;
  hint: string;
  tone: "primary" | "accent" | "info" | "warning";
}

export default function HomePage() {
  const [agenda, setAgenda] = useState<AgendaItem[] | null>(null);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const token = getToken();
    setAuthed(Boolean(token));
    if (!token) return;

    consultarAgenda()
      .then(setAgenda)
      .catch(() => setAgenda([]));
  }, []);

  const pendientes = agenda?.filter((a) => a.estado !== "CANCELADA").length ?? 0;

  const stats: Stat[] = [
    {
      label: "Reservas totales",
      value: agenda ? String(agenda.length) : "—",
      hint: "Registradas en tu agenda",
      tone: "primary",
    },
    {
      label: "Pendientes",
      value: agenda ? String(pendientes) : "—",
      hint: "Confirmadas o en curso",
      tone: "accent",
    },
    {
      label: "Servicios",
      value: "—",
      hint: "Catálogo activo",
      tone: "info",
    },
    {
      label: "Ocupación",
      value: agenda ? `${Math.round((pendientes / Math.max(agenda.length, 1)) * 100)}%` : "—",
      hint: "Del total reservado",
      tone: "warning",
    },
  ];

  const toneMap = {
    primary: "bg-primary-soft text-primary",
    accent: "bg-accent-soft text-accent-text",
    info: "bg-info-soft text-info-text",
    warning: "bg-warning-soft text-warning-text",
  };

  const recientes = agenda?.slice(0, 5) ?? [];

  return (
    <>
      <PageHeader
        eyebrow="Panel de control"
        title="Resumen de tu operación"
        description="Visualiza el estado de tus reservas, servicios y disponibilidad en un solo lugar."
        actions={
          <Link href="/reservas">
            <Button variant="primary">Nueva reserva</Button>
          </Link>
        }
      />

      {/* Stats */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} interactive className="p-6">
            <div className="flex items-start justify-between gap-3">
              <p className="text-body-sm font-medium text-ink-muted">{s.label}</p>
              <span className={`flex size-8 items-center justify-center rounded-md ${toneMap[s.tone]}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
                  <path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" />
                </svg>
              </span>
            </div>
            <p className="mt-4 text-display text-ink">
              {agenda === null && authed ? <Skeleton className="h-9 w-16" /> : s.value}
            </p>
            <p className="mt-1 text-caption text-ink-subtle">{s.hint}</p>
          </Card>
        ))}
      </section>

      {/* Contenido principal */}
      <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Actividad reciente */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between border-b border-line p-6 pb-4">
            <div>
              <h2 className="text-title-md text-ink">Reservas recientes</h2>
              <p className="text-body-sm text-ink-muted">Últimas 5 operaciones registradas</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => (window.location.href = "/agenda")}>
              Ver todas
            </Button>
          </div>

          <CardContent className="p-0">
            {!authed ? (
              <div className="empty-state p-12">
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="size-6">
                    <rect width="18" height="11" x="3" y="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-title-md text-ink">Inicia sesión para ver tu agenda</p>
                  <p className="max-w-sm text-body-sm text-ink-muted">
                    Necesitamos saber quién eres para mostrarte únicamente tus reservas.
                  </p>
                </div>
                <Link href="/login">
                  <Button variant="primary">Iniciar sesión</Button>
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
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="size-6">
                    <rect width="18" height="18" x="3" y="4" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-title-md text-ink">Todavía no tienes reservas</p>
                  <p className="max-w-sm text-body-sm text-ink-muted">
                    Crea tu primera reserva seleccionando un servicio y un horario disponible.
                  </p>
                </div>
                <Link href="/reservas">
                  <Button variant="primary">Crear reserva</Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th scope="col">Servicio</th>
                      <th scope="col">Estado</th>
                      <th scope="col">Creada</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recientes.map((r) => (
                      <tr key={r.id}>
                        <td className="font-mono text-caption text-ink">{r.servicioId?.slice(0, 8)}</td>
                        <td>
                          <Badge
                            variant={r.estado === "CANCELADA" ? "danger" : r.estado === "CONFIRMADA" ? "success" : "warning"}
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
          </CardContent>
        </Card>

        {/* Accesos rápidos */}
        <Card>
          <div className="border-b border-line p-6 pb-4">
            <h2 className="text-title-md text-ink">Acciones rápidas</h2>
            <p className="text-body-sm text-ink-muted">Atajos a las tareas más frecuentes</p>
          </div>
          <CardContent className="flex flex-col gap-2 p-4">
            {[
              { href: "/reservas", label: "Crear reserva", desc: "Agenda un nuevo servicio" },
              { href: "/agenda", label: "Ver agenda", desc: "Horarios y reservas activas" },
              { href: "/servicios", label: "Gestionar servicios", desc: "Catálogo de offerings" },
            ].map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="group flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-surface-subtle"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary-soft text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="size-4">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
                <span className="flex min-w-0 flex-col leading-tight">
                  <span className="text-body-sm font-semibold text-ink">{a.label}</span>
                  <span className="truncate text-caption text-ink-subtle">{a.desc}</span>
                </span>
              </Link>
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  );
}
