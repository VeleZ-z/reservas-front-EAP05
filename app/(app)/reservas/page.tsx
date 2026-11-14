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
import { EmptyState } from "@/components/ui/feedback";
import {
  RequiereSesion,
  RolNoPermitido,
} from "@/components/acceso-restringido";
import { crearReserva, cancelarReserva } from "@/src/api/reservas";
import { getSesion, type Sesion } from "@/src/api/sesion";
import {
  esUuid,
  listarReservas,
  guardarReserva,
  actualizarEstado,
  type ReservaLocal,
} from "@/src/lib/reservas-cliente";

export default function ReservasPage() {
  const [sesion, setSesion] = useState<Sesion | null>(null);
  const [form, setForm] = useState({ servicioId: "", horarioId: "" });
  const [reservas, setReservas] = useState<ReservaLocal[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cancelando, setCancelando] = useState<string | null>(null);

  useEffect(() => {
    const actual = getSesion();
    setSesion(actual);
    if (actual) setReservas(listarReservas(actual.usuario));
  }, []);

  const set =
    (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const refrescar = useCallback(() => {
    if (sesion) setReservas(listarReservas(sesion.usuario));
  }, [sesion]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMsg(null);

    if (!sesion) {
      setError("Debes iniciar sesión para crear reservas.");
      return;
    }
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
      guardarReserva(sesion.usuario, {
        id: res.id,
        servicioId: res.servicioId,
        servicioNombre: res.servicioNombre,
        horarioId: res.horarioId,
        horarioInicio: res.horarioInicio,
        horarioFin: res.horarioFin,
        recursoNombre: res.recursoNombre,
        estado: res.estado ?? "CONFIRMADA",
        creadaEn: res.creadaEn ?? new Date().toISOString(),
      });
      setMsg(
        res.estado
          ? `Reserva confirmada para “${res.servicioNombre ?? "el servicio"}”.`
          : "Reserva creada correctamente."
      );
      setForm({ servicioId: "", horarioId: "" });
      refrescar();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear la reserva");
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(id: string) {
    if (!sesion) return;
    setError(null);
    setMsg(null);
    setCancelando(id);
    try {
      const res = await cancelarReserva(id);
      actualizarEstado(sesion.usuario, id, "CANCELADA");
      setMsg(res.mensaje ?? "Reserva cancelada correctamente.");
      refrescar();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo cancelar la reserva"
      );
    } finally {
      setCancelando(null);
    }
  }

  const activas = reservas.filter((r) => r.estado !== "CANCELADA");

  return (
    <>
      <PageHeader
        eyebrow="Operación"
        title="Reservas"
        description="Selecciona el servicio y el horario solicitado para agendar una cita."
      />

      {!sesion ? (
        <RequiereSesion descripcion="Necesitamos tu sesión para asociar la reserva a tu cuenta y mostrarte tu historial." />
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Formulario */}
        <Card className="lg:col-span-2">
          <div className="border-b border-line p-6 pb-4">
            <h2 className="text-title-md text-ink">Nueva reserva</h2>
            <p className="text-body-sm text-ink-muted">
              Pega los UUID del servicio y del horario que te compartieron.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6" noValidate>
            <div className="flex flex-col gap-2">
              <Label htmlFor="servicioId" required hint="UUID del servicio a reservar.">
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
              <Label htmlFor="horarioId" required hint="UUID del horario disponible.">
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
              disabled={loading || !sesion}
            >
              {loading ? "Reservando…" : "Confirmar reserva"}
            </Button>

            <p className="text-caption text-ink-subtle">
              El servidor comprueba que el servicio exista, que el horario esté
              libre y que el recurso asociado esté disponible.
            </p>
          </form>
        </Card>

        {/* Listado */}
        <Card className="lg:col-span-3">
          <div className="flex items-center justify-between border-b border-line p-6 pb-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-title-md text-ink">Tus reservas</h2>
              <p className="text-body-sm text-ink-muted">
                {activas.length} reserva{activas.length === 1 ? "" : "s"} activa
                {activas.length === 1 ? "" : "s"}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={refrescar}>
              Actualizar
            </Button>
          </div>

          {reservas.length === 0 ? (
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
              description={
                sesion
                  ? "Crea tu primera reserva con el formulario de la izquierda."
                  : "Inicia sesión para ver y administrar tus reservas."
              }
              action={
                sesion ? null : (
                  <Link href="/login">
                    <Button variant="primary">Iniciar sesión</Button>
                  </Link>
                )
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
                    <th scope="col">Creada</th>
                    <th scope="col" className="text-right">
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reservas.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <span className="flex flex-col">
                          <span className="text-body-sm font-medium text-ink">
                            {r.servicioNombre ?? "Servicio"}
                          </span>
                          <span className="font-mono text-caption text-ink-subtle">
                            {r.servicioId.slice(0, 8)}
                          </span>
                        </span>
                      </td>
                      <td className="text-caption">
                        {r.horarioInicio
                          ? new Date(r.horarioInicio).toLocaleString("es-CO", {
                              dateStyle: "short",
                              timeStyle: "short",
                            })
                          : r.horarioId.slice(0, 8)}
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
                      <td className="text-caption">
                        {new Date(r.creadaEn).toLocaleString("es-CO", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </td>
                      <td className="text-right">
                        {r.estado === "CANCELADA" ? (
                          <span className="text-caption text-ink-subtle">—</span>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={cancelando === r.id}
                            onClick={() => handleCancel(r.id)}
                          >
                            {cancelando === r.id ? "Cancelando…" : "Cancelar"}
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
