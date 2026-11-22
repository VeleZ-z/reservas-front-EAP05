"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { SkeletonTable, EmptyState } from "@/components/ui/feedback";
import { RequiereSesion, RolNoPermitido } from "@/components/acceso-restringido";
import { consultarHistorial, type HistorialReservaResponse } from "@/src/api/reservas";
import { getSesion, type Sesion } from "@/src/api/sesion";
import { formatearFechaHora, formatearHora } from "@/src/lib/fechas";

export default function HistorialPage() {
  const [sesion, setSesion] = useState<Sesion | null>(null);
  const [items, setItems] = useState<HistorialReservaResponse[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const actual = getSesion();
    setSesion(actual);
    if (!actual || actual.rol !== "cliente") return;
    consultarHistorial()
      .then(setItems)
      .catch((e) => {
        setError(e instanceof Error ? e.message : "No se pudo cargar el historial");
        setItems([]);
      });
  }, []);

  const badgeVariant = (estado: string) =>
    estado === "CONFIRMADA"
      ? "success"
      : estado === "CANCELADA"
        ? "danger"
        : "warning";

  const esCliente = sesion?.rol === "cliente";

  return (
    <>
      <PageHeader
        eyebrow="Mi cuenta"
        title="Historial de reservas"
        description="Consulta todas tus reservas pasadas y su estado actual."
      />

      {error ? (
        <Alert variant="danger" title="Error al cargar" className="mb-6">
          {error}
        </Alert>
      ) : null}

      {!sesion ? (
        <RequiereSesion descripcion="El historial muestra tus reservas personales." />
      ) : !esCliente ? (
        <RolNoPermitido
          rolActual={sesion.rol}
          rolRequerido="Cliente"
          descripcion="El historial de reservas está disponible solo para clientes."
        />
      ) : (
        <Card>
          <div className="flex items-center justify-between border-b border-line p-6 pb-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-title-md text-ink">
                {items
                  ? `${items.length} reserva${items.length === 1 ? "" : "s"}`
                  : "Cargando…"}
              </h2>
              <p className="text-body-sm text-ink-muted">
                Ordenadas por fecha de creación
              </p>
            </div>
          </div>

          {items === null ? (
            <SkeletonTable rows={6} cols={5} />
          ) : items.length === 0 ? (
            <EmptyState
              icon={
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
              }
              title="Sin reservas"
              description="Aún no has realizado ninguna reserva."
              action={
                <Link href="/reservas">
                  <Button variant="primary">Crear reserva</Button>
                </Link>
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th scope="col">Servicio</th>
                    <th scope="col">Horario</th>
                    <th scope="col" className="hidden md:table-cell">
                      Recurso
                    </th>
                    <th scope="col">Estado</th>
                    <th scope="col" className="hidden lg:table-cell">
                      Creada
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((r) => (
                    <tr key={r.reservaId}>
                      <td className="font-medium text-ink">{r.nombreServicio || r.servicioId.slice(0, 8)}</td>
                      <td className="text-caption text-ink-muted">
                        {formatearFechaHora(r.inicio)} – {formatearHora(r.fin)}
                      </td>
                      <td className="hidden font-mono text-caption text-ink-muted md:table-cell">
                        {r.nombreRecurso || (r.recursoId ? r.recursoId.slice(0, 8) : "—")}
                      </td>
                      <td>
                        <Badge variant={badgeVariant(r.estado)} dot>
                          {r.estado}
                        </Badge>
                      </td>
                      <td className="hidden text-caption text-ink-muted lg:table-cell">
                        {formatearFechaHora(r.creadaEn)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}
    </>
  );
}