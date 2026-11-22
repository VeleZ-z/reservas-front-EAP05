"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/feedback";
import { RequiereSesion, RolNoPermitido } from "@/components/acceso-restringido";
import {
  consultarDisponibilidadServicio,
  type HorarioDisponibleResponse,
} from "@/src/api/servicios";
import { crearReserva, type CrearReservaResponse } from "@/src/api/reservas";
import { getSesion, type Sesion } from "@/src/api/sesion";
import { esUuid } from "@/src/lib/validaciones";
import { formatearFechaHora } from "@/src/lib/fechas";

export default function ServiciosDisponibilidadPage() {
  const [sesion, setSesion] = useState<Sesion | null>(null);
  const [servicioId, setServicioId] = useState("");
  const [horarios, setHorarios] = useState<HorarioDisponibleResponse[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [reserva, setReserva] = useState<CrearReservaResponse | null>(null);
  const [consultando, setConsultando] = useState(false);
  const [reservando, setReservando] = useState<string | null>(null);

  useEffect(() => {
    setSesion(getSesion());
  }, []);

  const esCliente = sesion?.rol === "cliente";

  async function handleConsultar(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMsg(null);
    setReserva(null);
    setHorarios(null);

    if (!esUuid(servicioId)) {
      setError("El ID del servicio no tiene un formato UUID válido.");
      return;
    }

    setConsultando(true);
    try {
      const data = await consultarDisponibilidadServicio(servicioId.trim());
      setHorarios(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo consultar la disponibilidad");
      setHorarios([]);
    } finally {
      setConsultando(false);
    }
  }

  async function handleReservar(horarioId: string) {
    setError(null);
    setMsg(null);
    setReservando(horarioId);
    try {
      const res = await crearReserva({ servicioId: servicioId.trim(), horarioId });
      setReserva(res);
      setMsg(`Reserva confirmada para “${res.servicioNombre ?? "el servicio"}”.`);
      // Quita el horario reservado de la lista de disponibles.
      setHorarios((h) => (h ? h.filter((x) => x.id !== horarioId) : h));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear la reserva");
    } finally {
      setReservando(null);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Cliente"
        title="Disponibilidad de servicios"
        description="Consulta los horarios libres de un servicio y reserva en un clic."
        actions={
          <Link href="/historial">
            <Button variant="outline">Ver mi historial</Button>
          </Link>
        }
      />

      {!sesion ? (
        <RequiereSesion descripcion="Consultar disponibilidad y reservar requiere una cuenta de cliente." />
      ) : !esCliente ? (
        <RolNoPermitido
          rolActual={sesion.rol}
          rolRequerido="Cliente"
          descripcion="Consultar disponibilidad y reservar requiere una cuenta de cliente."
        />
      ) : (
        <>
          {error ? (
            <Alert variant="danger" title="No se pudo completar la operación" className="mb-6">
              {error}
            </Alert>
          ) : null}
          {msg ? (
            <Alert variant="success" title="Operación completada" className="mb-6">
              {msg}
            </Alert>
          ) : null}

          <Card className="mb-6">
            <form onSubmit={handleConsultar} className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-[1fr_auto] sm:items-end">
              <div className="flex flex-col gap-2">
                <Label htmlFor="servicioId" required hint="UUID del servicio a consultar.">
                  ID del servicio
                </Label>
                <Input
                  id="servicioId"
                  value={servicioId}
                  onChange={(e) => setServicioId(e.target.value)}
                  placeholder="00000000-0000-0000-0000-000000000000"
                  spellCheck={false}
                  autoCapitalize="none"
                  className="font-mono text-body-sm"
                  invalid={servicioId.length > 0 && !esUuid(servicioId)}
                  required
                />
              </div>
              <Button type="submit" className="w-full sm:w-auto" disabled={consultando}>
                {consultando ? "Consultando…" : "Ver disponibilidad"}
              </Button>
            </form>
          </Card>

          {reserva ? (
            <Card className="mb-6">
              <div className="flex flex-wrap items-center gap-3 p-6">
                <Badge variant="success" dot>
                  {reserva.estado ?? "CONFIRMADA"}
                </Badge>
                <span className="text-body-sm text-ink">
                  {reserva.servicioNombre ?? "Servicio"} · {formatearFechaHora(reserva.horarioInicio)}
                </span>
                {reserva.recursoNombre ? (
                  <span className="text-caption text-ink-muted">Recurso: {reserva.recursoNombre}</span>
                ) : null}
                <code className="ml-auto font-mono text-caption text-ink-subtle">
                  {reserva.id}
                </code>
              </div>
            </Card>
          ) : null}

          <Card>
            <div className="flex items-center justify-between border-b border-line p-6 pb-4">
              <div className="flex flex-col gap-1">
                <h2 className="text-title-md text-ink">
                  {horarios
                    ? `${horarios.length} horario${horarios.length === 1 ? "" : "s"} disponible${horarios.length === 1 ? "" : "s"}`
                    : "Horarios disponibles"}
                </h2>
                <p className="text-body-sm text-ink-muted">
                  Solo se muestran horarios futuros en estado disponible.
                </p>
              </div>
            </div>

            {horarios === null ? (
              <div className="empty-state p-10">
                <p className="text-body-sm text-ink-muted">
                  Introduce el ID del servicio para consultar sus horarios.
                </p>
              </div>
            ) : horarios.length === 0 ? (
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
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                  </svg>
                }
                title="Sin horarios disponibles"
                description="Este servicio no tiene horarios libres por ahora. Prueba más tarde."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th scope="col">Inicio</th>
                      <th scope="col">Fin</th>
                      <th scope="col" className="hidden md:table-cell">
                        Proveedor
                      </th>
                      <th scope="col" className="text-right">
                        Acción
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {horarios.map((h) => (
                      <tr key={h.id}>
                        <td className="text-body-sm text-ink">{formatearFechaHora(h.inicio)}</td>
                        <td className="text-caption text-ink-muted">{formatearFechaHora(h.fin)}</td>
                        <td className="hidden font-mono text-caption text-ink-muted md:table-cell">
                          {h.proveedorId.slice(0, 8)}
                        </td>
                        <td className="text-right">
                          <Button
                            size="sm"
                            disabled={reservando === h.id}
                            onClick={() => handleReservar(h.id)}
                          >
                            {reservando === h.id ? "Reservando…" : "Reservar"}
                          </Button>
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
