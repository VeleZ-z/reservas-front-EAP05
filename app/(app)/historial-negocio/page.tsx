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
  consultarHistorialNegocio,
  type HistorialNegocioResponse,
} from "@/src/api/reservas";
import { getSesion, type Sesion } from "@/src/api/sesion";
import { formatearFechaHora } from "@/src/lib/fechas";

type FiltroEstado = "todas" | "CONFIRMADA" | "PENDIENTE" | "CANCELADA";
type FiltroTipo = "todos" | "SERVICIO" | "EVENTO";

export default function HistorialNegocioPage() {
  const [sesion, setSesion] = useState<Sesion | null>(null);
  const [items, setItems] = useState<HistorialNegocioResponse[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [estado, setEstado] = useState<FiltroEstado>("todas");
  const [tipo, setTipo] = useState<FiltroTipo>("todos");
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const actual = getSesion();
    setSesion(actual);
    if (!actual || actual.rol !== "administrador") return;
    consultarHistorialNegocio()
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
      const coincideEstado = estado === "todas" || i.estado === estado;
      const coincideTipo = tipo === "todos" || i.tipo === tipo;
      const coincideTexto =
        !q ||
        (i.nombreItem ?? "").toLowerCase().includes(q) ||
        (i.nombreCliente ?? "").toLowerCase().includes(q) ||
        i.reservaId.toLowerCase().includes(q) ||
        i.clienteId.toLowerCase().includes(q);
      return coincideEstado && coincideTipo && coincideTexto;
    });
  }, [items, estado, tipo, busqueda]);

  const badgeEstado = (valor: string) =>
    valor === "CONFIRMADA" ? "success" : valor === "CANCELADA" ? "danger" : "warning";

  const esAdmin = sesion?.rol === "administrador";

  return (
    <>
      <PageHeader
        eyebrow="Administración"
        title="Historial del negocio"
        description="Todas las reservas de servicios y eventos del negocio, con su estado actual."
      />

      {error ? (
        <Alert variant="danger" title="Error al cargar" className="mb-6">
          {error}
        </Alert>
      ) : null}

      {!sesion ? (
        <RequiereSesion descripcion="El historial global del negocio requiere una cuenta de administrador." />
      ) : !esAdmin ? (
        <RolNoPermitido
          rolActual={sesion.rol}
          rolRequerido="Administrador"
          descripcion="Consultar el historial del negocio requiere una cuenta de administrador."
        />
      ) : (
        <>
          <Card className="mb-6">
            <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-[1fr_auto_auto] sm:items-end">
              <div className="flex flex-col gap-2">
                <Label htmlFor="q">Buscar</Label>
                <Input
                  id="q"
                  placeholder="Ítem, cliente o ID de reserva…"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2 sm:w-44">
                <Label htmlFor="tipo">Tipo</Label>
                <Select
                  id="tipo"
                  value={tipo}
                  onValueChange={(v) => setTipo(v as FiltroTipo)}
                  options={[
                    { value: "todos", label: "Todos" },
                    { value: "SERVICIO", label: "Servicios" },
                    { value: "EVENTO", label: "Eventos" },
                  ]}
                />
              </div>
              <div className="flex flex-col gap-2 sm:w-52">
                <Label htmlFor="estado">Estado</Label>
                <Select
                  id="estado"
                  value={estado}
                  onValueChange={(v) => setEstado(v as FiltroEstado)}
                  options={[
                    { value: "todas", label: "Todos los estados" },
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
                  Servicios y eventos en una sola vista
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
                    <path d="M3 3v18h18" />
                    <path d="m19 9-5 5-4-4-3 3" />
                  </svg>
                }
                title={items.length === 0 ? "Sin reservas registradas" : "Sin resultados"}
                description={
                  items.length === 0
                    ? "Cuando se creen reservas de servicios o eventos aparecerán aquí."
                    : "Prueba con otro término de búsqueda o cambia los filtros."
                }
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th scope="col">Tipo</th>
                      <th scope="col">Ítem</th>
                      <th scope="col">Cliente</th>
                      <th scope="col">Inicio</th>
                      <th scope="col" className="hidden md:table-cell">
                        Fin
                      </th>
                      <th scope="col" className="hidden lg:table-cell">
                        Recurso
                      </th>
                      <th scope="col">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtrados.map((r) => (
                      <tr key={r.reservaId}>
                        <td>
                          <Badge variant={r.tipo === "EVENTO" ? "info" : "primary"}>
                            {r.tipo}
                          </Badge>
                        </td>
                        <td className="font-medium text-ink">
                          {r.nombreItem || r.itemId.slice(0, 8)}
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
                        <td className="hidden text-caption text-ink-muted md:table-cell">
                          {formatearFechaHora(r.fin)}
                        </td>
                        <td className="hidden font-mono text-caption text-ink-muted lg:table-cell">
                          {r.nombreRecurso || (r.recursoId ? r.recursoId.slice(0, 8) : "—")}
                        </td>
                        <td>
                          <Badge variant={badgeEstado(r.estado)} dot>
                            {r.estado}
                          </Badge>
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
