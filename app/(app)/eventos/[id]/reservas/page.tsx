"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { SkeletonTable, EmptyState } from "@/components/ui/feedback";
import { RequiereSesion, RolNoPermitido } from "@/components/acceso-restringido";
import { getSesion, type Sesion } from "@/src/api/sesion";
import { apiFetch, getToken } from "@/src/api/config";

interface ReservaEventoResponse {
  id: string;
  eventoId: string;
  clienteId: string;
  estado: string;
  cuposRestantes: number;
}

export default function EventoReservasPage() {
  const params = useParams();
  const id = params.id as string;
  const [items, setItems] = useState<ReservaEventoResponse[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const sesion = getSesion();
  const esAdmin = sesion?.rol === "administrador";

  useEffect(() => {
    apiFetch<ReservaEventoResponse[]>(`/api/eventos/${id}/reservas`, {
      method: "GET",
      token: getToken(),
    })
      .then(setItems)
      .catch((err) => {
        setError(err instanceof Error ? err.message : "No se pudieron cargar las reservas");
        setItems([]);
      });
  }, [id]);

  const badgeVariant = (estado: string) =>
    estado === "CONFIRMADA"
      ? "success"
      : estado === "CANCELADA"
        ? "danger"
        : "warning";

  return (
    <>
      <PageHeader
        eyebrow="Evento"
        title="Reservas del evento"
        description="Lista de reservas confirmadas y canceladas para este evento."
      />

      {error ? (
        <Alert variant="danger" title="Error al cargar" className="mb-6">
          {error}
        </Alert>
      ) : null}

      {!sesion ? (
        <RequiereSesion descripcion="Las reservas del evento son información restringida." />
      ) : !esAdmin && sesion?.rol !== "cliente" ? (
        <RolNoPermitido
          rolActual={sesion.rol}
          rolRequerido="Administrador o Cliente"
          descripcion="Ver las reservas de un evento requiere permisos de administrador o ser el cliente."
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
            <SkeletonTable rows={6} cols={4} />
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
              description="Este evento no tiene reservas registradas."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th scope="col">ID Reserva</th>
                    <th scope="col">Cliente</th>
                    <th scope="col">Estado</th>
                    <th scope="col">Cupos restantes</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((r) => (
                    <tr key={r.id}>
                      <td className="font-mono text-caption text-ink">
                        {r.id.slice(0, 8)}
                      </td>
                      <td className="font-mono text-caption text-ink-muted">
                        {r.clienteId.slice(0, 8)}
                      </td>
                      <td>
                        <Badge variant={badgeVariant(r.estado)} dot>
                          {r.estado}
                        </Badge>
                      </td>
                      <td className="text-body-sm text-ink-muted">{r.cuposRestantes}</td>
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