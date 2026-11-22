"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { SkeletonTable, EmptyState } from "@/components/ui/feedback";
import { Badge } from "@/components/ui/badge";
import { consultarUsoServicios } from "@/src/api/servicios";
import { getSesion, type Sesion } from "@/src/api/sesion";

export default function ServiciosUsoPage() {
  const [sesion, setSesion] = useState<Sesion | null>(null);
  const [items, setItems] = useState<{ servicioId: string; nombre: string; reservas: number }[] | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

  useEffect(() => {
    const actual = getSesion();
    setSesion(actual);
  }, []);

  async function cargarReporte(e: React.FormEvent) {
    e.preventDefault();
    if (!desde || !hasta) {
      setError("Debes seleccionar ambas fechas");
      return;
    }
    setError(null);
    try {
      const data = await consultarUsoServicios(desde, hasta);
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar el reporte de uso");
      setItems([]);
    }
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

      {error ? (
        <Alert variant="danger" title="Error al cargar" className="mb-6">
          {error}
        </Alert>
      ) : null}

      {!sesion ? (
        <div className="flex flex-col items-center justify-center py-20">
          <h2 className="text-title-md text-ink">Protegido</h2>
          <p className="text-body text-ink-muted">Inicia sesión para acceder.</p>
        </div>
      ) : (
        <Card>
          <div className="flex items-center justify-between border-b border-line p-6 pb-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-title-md text-ink">
                {items
                  ? `${items.length} ${items.length === 1 ? "servicio" : "servicios"}`
                  : "Cargando…"}
              </h2>
            </div>
          </div>

          {items === null ? (
            <SkeletonTable rows={5} cols={3} />
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
                    <th scope="col">ID</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((s) => (
                    <tr key={s.servicioId}>
                      <td className="font-medium text-ink">{s.nombre}</td>
                      <td>
                        <Badge variant={badgeVariant(s.reservas)} dot>{s.reservas}</Badge>
                      </td>
                      <td className="font-mono text-caption text-ink-muted">
                        {s.servicioId.slice(0, 8)}
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