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
import { aLocalDateTime, rangoReportePorDefecto } from "@/src/lib/fechas";

export default function EventosPage() {
  const [sesion, setSesion] = useState<Sesion | null>(null);
  const [items, setItems] = useState<OcupacionEventoResponse[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [cargando, setCargando] = useState(false);

  const esAdmin = sesion?.rol === "administrador";

  async function cargar(d: string, h: string) {
    setCargando(true);
    try {
      const data = await consultarOcupacionEvento(aLocalDateTime(d), aLocalDateTime(h));
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar la ocupación");
      setItems([]);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    const actual = getSesion();
    setSesion(actual);
    const rango = rangoReportePorDefecto(60);
    setDesde(rango.desde);
    setHasta(rango.hasta);
    if (actual?.rol === "administrador") {
      void cargar(rango.desde, rango.hasta);
    }
    // La carga inicial solo depende del rol leído al montar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function cargarOcupacion(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!desde || !hasta) {
      setError("Debes seleccionar ambas fechas.");
      return;
    }
    if (new Date(hasta) <= new Date(desde)) {
      setError("La fecha «hasta» debe ser posterior a «desde».");
      return;
    }
    await cargar(desde, hasta);
  }

  return (
    <>
      <PageHeader
        eyebrow="Administración"
        title="Ocupación de eventos"
        description="Consulta la capacidad, cupos reservados y porcentaje de ocupación por evento en un periodo."
        actions={
          <Link href="/eventos/registrar">
            <Button variant="primary">Registrar evento</Button>
          </Link>
        }
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
                  {cargando
                    ? "Consultando…"
                    : items
                      ? `${items.length} evento${items.length === 1 ? "" : "s"} en el periodo`
                      : "Sin consultar"}
                </h2>
                <p className="text-body-sm text-ink-muted">
                  Ordenados por fecha de inicio
                </p>
              </div>
            </div>

            {cargando ? (
              <SkeletonTable rows={5} cols={6} />
            ) : items === null ? (
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
                title="Elige un periodo"
                description="Selecciona el rango de fechas y pulsa «Consultar» para ver la ocupación."
              />
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
                      <th scope="col" className="hidden md:table-cell">
                        Capacidad
                      </th>
                      <th scope="col" className="hidden sm:table-cell">
                        Reservados
                      </th>
                      <th scope="col">Ocupación</th>
                      <th scope="col" className="hidden lg:table-cell">
                        ID
                      </th>
                      <th scope="col" className="text-right">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((r) => (
                      <tr key={r.eventoId}>
                        <td className="font-medium text-ink">{r.nombre}</td>
                        <td className="hidden text-body-sm text-ink-muted md:table-cell">
                          {r.capacidad}
                        </td>
                        <td className="hidden text-body-sm text-ink-muted sm:table-cell">{r.reservados}</td>
                        <td>
                          <Badge
                            variant={
                              r.porcentajeOcupacion >= 90
                                ? "danger"
                                : r.porcentajeOcupacion >= 70
                                  ? "warning"
                                  : "success"
                            }
                            dot
                          >
                            {r.porcentajeOcupacion.toFixed(1)}%
                          </Badge>
                        </td>
                        <td className="hidden font-mono text-caption text-ink-muted lg:table-cell">
                          {r.eventoId.slice(0, 8)}
                        </td>
                        <td>
                          <div className="flex flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-2">
                            <Link href={`/eventos/${r.eventoId}/capacidad`}>
                              <Button variant="ghost" size="sm">
                                Capacidad
                              </Button>
                            </Link>
                            <Link href={`/eventos/${r.eventoId}/actualizar`}>
                              <Button variant="outline" size="sm">
                                Editar
                              </Button>
                            </Link>
                          </div>
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
