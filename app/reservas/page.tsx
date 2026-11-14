"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { crearReserva, cancelarReserva } from "@/src/api/reservas";
import { consultarAgenda, type AgendaItem } from "@/src/api/agenda";
import { getToken } from "@/src/api/config";

export default function ReservasPage() {
  const [form, setForm] = useState({ servicioId: "", horarioId: "" });
  const [agenda, setAgenda] = useState<AgendaItem[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  async function refresh() {
    try {
      setAgenda(await consultarAgenda());
    } catch {
      setAgenda([]);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMsg(null);

    if (!getToken()) {
      setError("Debes iniciar sesión para crear reservas.");
      return;
    }
    if (!form.servicioId || !form.horarioId) {
      setError("Completa el servicio y el horario antes de reservar.");
      return;
    }

    setLoading(true);
    try {
      const res = await crearReserva(form);
      setMsg(res.mensaje ?? "Reserva creada correctamente.");
      setForm({ servicioId: "", horarioId: "" });
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear la reserva");
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(id: string) {
    setError(null);
    setMsg(null);
    try {
      const res = await cancelarReserva(id);
      setMsg(res.mensaje ?? "Reserva cancelada.");
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cancelar la reserva");
    }
  }

  const pendientes = agenda.filter((a) => a.estado !== "CANCELADA");

  return (
    <>
      <PageHeader
        eyebrow="Operación"
        title="Reservas"
        description="Crea una reserva nueva cancelando el horario y el servicio, o administra las existentes."
      />

      {error ? (
        <Alert variant="danger" title="Error" className="mb-6">
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
              Selecciona el servicio y el horario solicitado.
            </p>
          </div>

          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
              <div className="flex flex-col gap-2">
                <Label htmlFor="servicioId" required hint="UUID del servicio a reservar.">
                  Servicio
                </Label>
                <Input
                  id="servicioId"
                  value={form.servicioId}
                  onChange={set("servicioId")}
                  placeholder="00000000-0000-0000-0000-000000000000"
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
                  required
                />
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
                {loading ? "Reservando…" : "Confirmar reserva"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Listado */}
        <Card className="lg:col-span-3">
          <div className="flex items-center justify-between border-b border-line p-6 pb-4">
            <div>
              <h2 className="text-title-md text-ink">Reservas activas</h2>
              <p className="text-body-sm text-ink-muted">
                {pendientes.length} reserva{pendientes.length === 1 ? "" : "s"} sin cancelar
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={refresh}>
              Actualizar
            </Button>
          </div>

          {pendientes.length === 0 ? (
            <div className="empty-state p-12">
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="size-6">
                  <rect width="18" height="18" x="3" y="4" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-title-md text-ink">No hay reservas activas</p>
                <p className="max-w-sm text-body-sm text-ink-muted">
                  Crea una reserva desde el formulario o inicia sesión para ver tu agenda.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Servicio</th>
                    <th scope="col">Estado</th>
                    <th scope="col">Creada</th>
                    <th scope="col" className="text-right">
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pendientes.map((r) => (
                    <tr key={r.id}>
                      <td className="font-mono text-caption text-ink">{r.id.slice(0, 8)}</td>
                      <td className="font-mono text-caption">{r.servicioId?.slice(0, 8)}</td>
                      <td>
                        <Badge
                          variant={r.estado === "CONFIRMADA" ? "success" : "warning"}
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
                        <Button variant="ghost" size="sm" onClick={() => handleCancel(r.id)}>
                          Cancelar
                        </Button>
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
  );
}
