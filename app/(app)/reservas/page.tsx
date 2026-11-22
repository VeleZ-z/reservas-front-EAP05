"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { EmptyState, SkeletonTable } from "@/components/ui/feedback";
import {
  RequiereSesion,
  RolNoPermitido,
} from "@/components/acceso-restringido";
import {
  crearReserva,
  cancelarReserva,
  consultarHistorial,
  type HistorialReservaResponse,
} from "@/src/api/reservas";
import { getSesion, type Sesion } from "@/src/api/sesion";
import { esUuid } from "@/src/lib/validaciones";
import { formatearFechaHora, formatearHora } from "@/src/lib/fechas";

export default function ReservasPage() {
  const [sesion, setSesion] = useState<Sesion | null>(null);
  const [form, setForm] = useState({ servicioId: "", horarioId: "" });
  const [reservas, setReservas] = useState<HistorialReservaResponse[] | null>(
    null
  );
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cancelando, setCancelando] = useState<string | null>(null);

  const esCliente = sesion?.rol === "cliente";

  const cargar = useCallback(async () => {
    try {
      const data = await consultarHistorial();
      setReservas(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudieron cargar tus reservas"
      );
      setReservas([]);
    }
  }, []);

  useEffect(() => {
    const actual = getSesion();
    setSesion(actual);
    if (actual?.rol === "cliente") {
      void cargar();
    }
  }, [cargar]);

  const set =
    (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMsg(null);

    if (!esUuid(form.servicioId)) {
      setError("El ID del servicio no tiene un formato UUID válido.");
      return;
    }
    if (!esUuid(form.horarioId)) {
      setError("El ID del horario no tiene un formato UUID válido.");
      return;
    }

    setLoading(true);
    try {
      const res = await crearReserva({
        servicioId: form.servicioId.trim(),
        horarioId: form.horarioId.trim(),
      });
      setMsg(
        `Reserva confirmada para “${res.servicioNombre ?? "el servicio"}”.`
      );
      setForm({ servicioId: "", horarioId: "" });
      await cargar();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo crear la reserva"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(id: string) {
    setError(null);
    setMsg(null);
    setCancelando(id);
    try {
      const res = await cancelarReserva(id);
      setMsg(res.mensaje ?? "Reserva cancelada correctamente.");
      await cargar();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo cancelar la reserva"
      );
    } finally {
      setCancelando(null);
    }
  }

  const activas = (reservas ?? []).filter((r) => r.estado !== "CANCELADA");

  return (
    <>
      <PageHeader
        eyebrow="Cliente"
        title="Reservas"
        description="Agenda una cita con el ID del servicio y el horario disponible."
        actions={
          <Link href="/servicios/disponibilidad">
            <Button variant="outline">Ver disponibilidad</Button>
          </Link>
        }
      />

      {!sesion ? (
        <RequiereSesion descripcion="Necesitamos tu sesión para asociar la reserva a tu cuenta y mostrarte tus reservas." />
      ) : !esCliente ? (
        <RolNoPermitido
          rolActual={sesion.rol}
          rolRequerido="Cliente"
          descripcion="Crear y cancelar reservas requiere una cuenta de cliente."
        />
      ) : (
        <>
          {error ? (
            <Alert
              variant="danger"
              title="No se pudo completar la operación"
              className="mb-6"
            >
              {error}
            </Alert>
          ) : null}
          {msg ? (
            <Alert
              variant="success"
              title="Operación completada"
              className="mb-6"
            >
              {msg}
            </Alert>
          ) : null}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            {/* Formulario */}
            <Card className="lg:col-span-2">
              <div className="border-b border-line p-6 pb-4">
                <h2 className="text-title-md text-ink">Nueva reserva</h2>
                <p className="text-body-sm text-ink-muted">
                  Pega los UUID del servicio y del horario que te compartieron.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-5 p-6"
                noValidate
              >
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="servicioId"
                    required
                    hint="UUID del servicio a reservar."
                  >
                    Servicio
                  </Label>
                  <Input
                    id="servicioId"
                    value={form.servicioId}
                    onChange={set("servicioId")}
                    placeholder="00000000-0000-0000-0000-000000000000"
                    spellCheck={false}
                    autoCapitalize="none"
                    className="font-mono text-body-sm"
                    invalid={form.servicioId.length > 0 && !esUuid(form.servicioId)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="horarioId"
                    required
                    hint="UUID del horario disponible."
                  >
                    Horario
                  </Label>
                  <Input
                    id="horarioId"
                    value={form.horarioId}
                    onChange={set("horarioId")}
                    placeholder="00000000-0000-0000-0000-000000000000"
                    spellCheck={false}
                    autoCapitalize="none"
                    className="font-mono text-body-sm"
                    invalid={form.horarioId.length > 0 && !esUuid(form.horarioId)}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? "Reservando…" : "Confirmar reserva"}
                </Button>

                <p className="text-caption text-ink-subtle">
                  El servidor comprueba que el servicio exista, que el horario
                  esté libre y que el recurso asociado esté disponible. Si no
                  conoces los UUID,{" "}
                  <Link
                    href="/servicios/disponibilidad"
                    className="text-ink-brand underline"
                  >
                    consulta la disponibilidad
                  </Link>
                  .
                </p>
              </form>
            </Card>

            {/* Reservas */}
            <Card className="lg:col-span-3">
              <div className="flex items-center justify-between border-b border-line p-6 pb-4">
                <div className="flex flex-col gap-1">
                  <h2 className="text-title-md text-ink">Tus reservas</h2>
                  <p className="text-body-sm text-ink-muted">
                    {reservas
                      ? `${activas.length} activa${activas.length === 1 ? "" : "s"} de ${reservas.length}`
                      : "Cargando…"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => void cargar()}>
                    Actualizar
                  </Button>
                  <Link href="/historial">
                    <Button variant="ghost" size="sm">
                      Historial
                    </Button>
                  </Link>
                </div>
              </div>

              {reservas === null ? (
                <SkeletonTable rows={5} cols={4} />
              ) : reservas.length === 0 ? (
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
                  title="Sin reservas todavía"
                  description="Crea tu primera reserva con el formulario de la izquierda."
                  action={
                    <Link href="/servicios/disponibilidad">
                      <Button variant="primary">Buscar horarios</Button>
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
                        <th scope="col">Estado</th>
                        <th scope="col" className="text-right">
                          Acción
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservas.map((r) => (
                        <tr key={r.reservaId}>
                          <td>
                            <span className="flex flex-col">
                              <span className="text-body-sm font-medium text-ink">
                                {r.nombreServicio || "Servicio"}
                              </span>
                              <span className="font-mono text-caption text-ink-subtle">
                                {r.servicioId.slice(0, 8)}
                              </span>
                            </span>
                          </td>
                          <td className="text-caption text-ink-muted">
                            {formatearFechaHora(r.inicio)} – {formatearHora(r.fin)}
                          </td>
                          <td>
                            <Badge
                              variant={
                                r.estado === "CANCELADA"
                                  ? "danger"
                                  : r.estado === "CONFIRMADA"
                                    ? "success"
                                    : "warning"
                              }
                              dot
                            >
                              {r.estado}
                            </Badge>
                          </td>
                          <td className="text-right">
                            {r.estado === "CANCELADA" ? (
                              <span className="text-caption text-ink-subtle">
                                —
                              </span>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={cancelando === r.reservaId}
                                onClick={() => handleCancel(r.reservaId)}
                              >
                                {cancelando === r.reservaId
                                  ? "Cancelando…"
                                  : "Cancelar"}
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        </>
      )}
    </>
  );
}
