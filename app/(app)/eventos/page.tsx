"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { SkeletonTable, EmptyState } from "@/components/ui/feedback";
import { RequiereSesion, RolNoPermitido } from "@/components/acceso-restringido";
import { consultarOcupacionEvento, type OcupacionEventoResponse } from "@/src/api/eventos";
import { getSesion, type Sesion } from "@/src/api/sesion";

export default function EventosPage() {
  const [sesion, setSesion] = useState<Sesion | null>(null);
  const [items, setItems] = useState<OcupacionEventoResponse[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

  const esAdmin = sesion?.rol === "administrador";

  useEffect(() => {
    const actual = getSesion();
    setSesion(actual);
  }, []);

  async function cargarOcupacion(e: React.FormEvent) {
    e.preventDefault();
    if (!desde || !hasta) {
      setError("Debes seleccionar ambas fechas");
      return;
    }
    setError(null);
    try {
      const data = await consultarOcupacionEvento(desde, hasta);
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar la ocupación");
      setItems([]);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Administración"
        title="Ocupación de eventos"
        description="Consulta la capacidad, cupos reservados y porcentaje de ocupación por evento en un periodo."
      />

      {error ? (
        <Alert variant="danger" title="Error al cargar" className="mb-6">
          {error}
        </Alert>
      ) : null}

      {!sesion ? (
        <RequiereSesion descripcion="La ocupación de eventos es información restringida para administradores." />
      ) : !esAdmin ? (
        <RolNoPermitido
          rolActual={sesion.rol}
          rolRequerido="Administrador"
          descripcion="Consultar la ocupación de eventos requiere una cuenta de administrador."
        />
      ) : (
        <>
          {/* Filtro de fechas */}
          <Card className="mb-6">
            <form onSubmit={cargarOcupacion} className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
              <div className="flex flex-col gap-2">
                <Label htmlFor="desde">Desde</Label>
                <Input
                  id="desde"
                  type="datetime-local"
                  value={desde}
                  onChange={(e) => setDesde(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="hasta">Hasta</Label>
                <Input
                  id="hasta"
                  type="datetime-local"
                  value={hasta}
                  onChange={(e) => setHasta(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full sm:w-auto">
                Consultar
              </Button>
            </form>
          </Card>

          {/* Tabla de ocupación */}
          <Card>
            <div className="flex items-center justify-between border-b border-line p-6 pb-4">
              <div className="flex flex-col gap-1">
                <h2 className="text-title-md text-ink">
                  {items
                    ? `${items.length} evento${items.length === 1 ? "" : "s"} en el periodo`
                    : "Cargando…"}
                </h2>
                <p className="text-body-sm text-ink-muted">
                  Ordenados por fecha de inicio
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
                    <path d="M3 3v18h18" />
                    <path d="m19 9-5 5-4-4-3 3" />
                  </svg>
                }
                title="Sin datos de ocupación"
                description="No existen eventos con reservas en el periodo seleccionado."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th scope="col">Evento</th>
                      <th scope="col">Capacidad</th>
                      <th scope="col">Reservados</th>
                      <th scope="col">Ocupación</th>
                      <th scope="col">ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((r) => (
                      <tr key={r.eventoId}>
                        <td className="font-medium text-ink">{r.nombre}</td>
                        <td className="text-body-sm text-ink-muted">{r.capacidad}</td>
                        <td className="text-body-sm text-ink-muted">{r.reservados}</td>
                        <td>
                          <Badge
                            variant={r.porcentajeOcupacion >= 90 ? "danger" : r.porcentajeOcupacion >= 70 ? "warning" : "success"}
                            dot
                          >
                            {r.porcentajeOcupacion.toFixed(1)}%
                          </Badge>
                        </td>
                        <td className="font-mono text-caption text-ink-muted">
                          {r.eventoId.slice(0, 8)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      )}
    </>
  );
}