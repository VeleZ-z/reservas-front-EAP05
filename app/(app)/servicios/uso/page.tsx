"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { SkeletonTable, EmptyState } from "@/components/ui/feedback";
import { RequiereSesion, RolNoPermitido } from "@/components/acceso-restringido";
import { consultarUsoServicios, type UsoServicioResponse } from "@/src/api/servicios";
import { getSesion, type Sesion } from "@/src/api/sesion";
import { aLocalDateTime, rangoReportePorDefecto } from "@/src/lib/fechas";

export default function ServiciosUsoPage() {
  const [sesion, setSesion] = useState<Sesion | null>(null);
  const [items, setItems] = useState<UsoServicioResponse[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [cargando, setCargando] = useState(false);

  const esAdmin = sesion?.rol === "administrador";

  async function cargar(d: string, h: string) {
    setCargando(true);
    try {
      const data = await consultarUsoServicios(aLocalDateTime(d), aLocalDateTime(h));
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar el reporte de uso");
      setItems([]);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    const actual = getSesion();
    setSesion(actual);
    const rango = rangoReportePorDefecto(30);
    setDesde(rango.desde);
    setHasta(rango.hasta);
    if (actual?.rol === "administrador") {
      void cargar(rango.desde, rango.hasta);
    }
    // La carga inicial solo depende del rol leído al montar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function cargarReporte(e: React.FormEvent) {
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

  const badgeVariant = (reservas: number) =>
    reservas >= 50 ? "danger" : reservas >= 20 ? "warning" : "success";

  return (
    <>
      <PageHeader
        eyebrow="Administración"
        title="Uso de servicios"
        description="Cantidad de reservas por servicio en el periodo consultado."
      />

      {error ? (
        <Alert variant="danger" title="Error al cargar" className="mb-6">
          {error}
        </Alert>
      ) : null}

      {!sesion ? (
        <RequiereSesion descripcion="El reporte de uso es información restringida para administradores." />
      ) : !esAdmin ? (
        <RolNoPermitido
          rolActual={sesion.rol}
          rolRequerido="Administrador"
          descripcion="Consultar el uso de servicios requiere una cuenta de administrador."
        />
      ) : (
        <>
          <Card className="mb-6">
            <form onSubmit={cargarReporte} className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
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
                Generar reporte
              </Button>
            </form>
          </Card>

          <Card>
            <div className="flex items-center justify-between border-b border-line p-6 pb-4">
              <div className="flex flex-col gap-1">
                <h2 className="text-title-md text-ink">
                  {cargando
                    ? "Consultando…"
                    : items
                      ? `${items.length} ${items.length === 1 ? "servicio" : "servicios"}`
                      : "Sin consultar"}
                </h2>
                <p className="text-body-sm text-ink-muted">
                  Ordenados de más a menos usado
                </p>
              </div>
            </div>

            {cargando ? (
              <SkeletonTable rows={5} cols={3} />
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
                description="Selecciona el rango de fechas y pulsa «Generar reporte»."
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
                title="Sin datos de uso"
                description="No existen reservas para el periodo seleccionado."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th scope="col">Servicio</th>
                      <th scope="col">Reservas</th>
                      <th scope="col" className="hidden md:table-cell">
                        ID
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((s) => (
                      <tr key={s.servicioId}>
                        <td className="font-medium text-ink">{s.nombre}</td>
                        <td>
                          <Badge variant={badgeVariant(s.reservas)} dot>
                            {s.reservas}
                          </Badge>
                        </td>
                        <td className="hidden font-mono text-caption text-ink-muted md:table-cell">
                          {s.servicioId.slice(0, 8)}
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
