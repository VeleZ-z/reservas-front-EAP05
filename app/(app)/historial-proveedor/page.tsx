"use client";

import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Alert } from "@/components/ui/alert";
import { SkeletonTable, EmptyState } from "@/components/ui/feedback";
import { RequiereSesion, RolNoPermitido } from "@/components/acceso-restringido";
import {
  consultarHistorialProveedor,
  type HistorialProveedorResponse,
} from "@/src/api/reservas";
import { getSesion, type Sesion } from "@/src/api/sesion";
import { formatearFechaHora } from "@/src/lib/fechas";

type Filtro = "todas" | "CONFIRMADA" | "PENDIENTE" | "CANCELADA";

export default function HistorialProveedorPage() {
  const [sesion, setSesion] = useState<Sesion | null>(null);
  const [items, setItems] = useState<HistorialProveedorResponse[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<Filtro>("todas");
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const actual = getSesion();
    setSesion(actual);
    if (!actual || actual.rol !== "proveedor") return;
    consultarHistorialProveedor()
      .then(setItems)
      .catch((e) => {
        setError(e instanceof Error ? e.message : "No se pudo cargar el historial");
        setItems([]);
      });
  }, []);

  const filtrados = useMemo(() => {
    if (!items) return [];
    const q = busqueda.trim().toLowerCase();
    return items.filter((i) => {
      const coincideEstado = filtro === "todas" || i.estado === filtro;
      const coincideTexto =
        !q ||
        (i.nombreServicio ?? "").toLowerCase().includes(q) ||
        (i.nombreCliente ?? "").toLowerCase().includes(q) ||
        i.reservaId.toLowerCase().includes(q) ||
        i.clienteId.toLowerCase().includes(q);
      return coincideEstado && coincideTexto;
    });
  }, [items, filtro, busqueda]);

  const badgeVariant = (estado: string) =>
    estado === "CONFIRMADA" ? "success" : estado === "CANCELADA" ? "danger" : "warning";

  const esProveedor = sesion?.rol === "proveedor";

  return (
    <>
      <PageHeader
        eyebrow="Proveedor"
        title="Historial de reservas"
        description="Reservas asociadas a los servicios y horarios que atiendes, con datos del cliente."
      />

      {error ? (
        <Alert variant="danger" title="Error al cargar" className="mb-6">
          {error}
        </Alert>
      ) : null}

      {!sesion ? (
        <RequiereSesion descripcion="El historial del proveedor muestra las reservas de tus servicios." />
      ) : !esProveedor ? (
        <RolNoPermitido
          rolActual={sesion.rol}
          rolRequerido="Proveedor"
          descripcion="Este historial requiere una cuenta de proveedor."
        />
      ) : (
        <>
          <Card className="mb-6">
            <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-[1fr_auto] sm:items-end">
              <div className="flex flex-col gap-2">
                <Label htmlFor="q">Buscar</Label>
                <Input
                  id="q"
                  placeholder="Servicio, cliente o ID de reserva…"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2 sm:w-56">
                <Label htmlFor="filtro">Estado</Label>
                <Select
                  id="filtro"
                  value={filtro}
                  onValueChange={(v) => setFiltro(v as Filtro)}
                  options={[
                    { value: "todas", label: "Todas las reservas" },
                    { value: "CONFIRMADA", label: "Confirmadas" },
                    { value: "PENDIENTE", label: "Pendientes" },
                    { value: "CANCELADA", label: "Canceladas" },
                  ]}
                />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between border-b border-line p-6 pb-4">
              <div className="flex flex-col gap-1">
                <h2 className="text-title-md text-ink">
                  {items
                    ? `${filtrados.length} reserva${filtrados.length === 1 ? "" : "s"}`
                    : "Cargando…"}
                </h2>
                <p className="text-body-sm text-ink-muted">
                  Ordenadas por fecha de creación
                </p>
              </div>
            </div>

            {items === null ? (
              <SkeletonTable rows={6} cols={6} />
            ) : filtrados.length === 0 ? (
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
                title={items.length === 0 ? "Sin reservas registradas" : "Sin resultados"}
                description={
                  items.length === 0
                    ? "Cuando los clientes reserven tus servicios aparecerán aquí."
                    : "Prueba con otro término de búsqueda o cambia el filtro de estado."
                }
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th scope="col">Servicio</th>
                      <th scope="col">Cliente</th>
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
                    {filtrados.map((r) => (
                      <tr key={r.reservaId}>
                        <td className="font-medium text-ink">
                          {r.nombreServicio || r.servicioId.slice(0, 8)}
                        </td>
                        <td>
                          <span className="flex flex-col">
                            <span className="text-body-sm text-ink">
                              {r.nombreCliente || "Cliente"}
                            </span>
                            <span className="font-mono text-caption text-ink-subtle">
                              {r.clienteId.slice(0, 8)}
                            </span>
                          </span>
                        </td>
                        <td className="text-caption text-ink-muted">
                          {formatearFechaHora(r.inicio)}
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
        </>
      )}
    </>
  );
}
