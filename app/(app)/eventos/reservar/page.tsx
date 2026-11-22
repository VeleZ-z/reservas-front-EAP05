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
import { RequiereSesion, RolNoPermitido } from "@/components/acceso-restringido";
import {
  reservarCupoEvento,
  cancelarReservaEvento,
  type ReservaEventoResponse,
} from "@/src/api/eventos";
import { getSesion, type Sesion } from "@/src/api/sesion";
import { esUuid } from "@/src/lib/validaciones";

export default function EventosReservarPage() {
  const [sesion, setSesion] = useState<Sesion | null>(null);
  const [eventoId, setEventoId] = useState("");
  const [reserva, setReserva] = useState<ReservaEventoResponse | null>(null);
  const [cancelEventoId, setCancelEventoId] = useState("");
  const [cancelReservaId, setCancelReservaId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cancelando, setCancelando] = useState(false);
  const [copiado, setCopiado] = useState<string | null>(null);

  useEffect(() => {
    setSesion(getSesion());
  }, []);

  const esCliente = sesion?.rol === "cliente";

  async function copiar(texto: string) {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(texto);
      window.setTimeout(() => setCopiado(null), 1800);
    } catch {
      setError("No se pudo copiar al portapapeles.");
    }
  }

  async function handleReservar(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMsg(null);
    setReserva(null);

    if (!esUuid(eventoId)) {
      setError("El ID del evento no tiene un formato UUID válido.");
      return;
    }

    setLoading(true);
    try {
      const res = await reservarCupoEvento(eventoId.trim());
      setReserva(res);
      setMsg("Cupo reservado correctamente.");
      setCancelEventoId(res.eventoId);
      setCancelReservaId(res.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo reservar el cupo");
    } finally {
      setLoading(false);
    }
  }

  async function handleCancelar(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMsg(null);

    if (!esUuid(cancelEventoId) || !esUuid(cancelReservaId)) {
      setError("Los IDs del evento y de la reserva deben ser UUID válidos.");
      return;
    }

    setCancelando(true);
    try {
      await cancelarReservaEvento(cancelEventoId.trim(), cancelReservaId.trim());
      setMsg("Reserva cancelada. El cupo vuelve a estar disponible.");
      setReserva(null);
      setCancelReservaId("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cancelar la reserva");
    } finally {
      setCancelando(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Eventos"
        title="Reservar cupo en un evento"
        description="Reserva tu lugar con el ID del evento o cancela una reserva existente (mínimo 12 horas antes del inicio)."
        actions={
          <Link href="/historial">
            <Button variant="outline">Ver mi historial</Button>
          </Link>
        }
      />

      {!sesion ? (
        <RequiereSesion descripcion="Reservar cupos en eventos requiere una cuenta de cliente." />
      ) : !esCliente ? (
        <RolNoPermitido
          rolActual={sesion.rol}
          rolRequerido="Cliente"
          descripcion="Reservar cupos en eventos requiere una cuenta de cliente."
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

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Reservar */}
            <Card>
              <div className="border-b border-line p-6 pb-4">
                <h2 className="text-title-md text-ink">Reservar cupo</h2>
                <p className="text-body-sm text-ink-muted">
                  Pega el UUID del evento que te compartieron.
                </p>
              </div>
              <form onSubmit={handleReservar} className="flex flex-col gap-5 p-6" noValidate>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="eventoId" required hint="UUID del evento.">
                    ID del evento
                  </Label>
                  <Input
                    id="eventoId"
                    value={eventoId}
                    onChange={(e) => setEventoId(e.target.value)}
                    placeholder="00000000-0000-0000-0000-000000000000"
                    spellCheck={false}
                    autoCapitalize="none"
                    className="font-mono text-body-sm"
                    invalid={eventoId.length > 0 && !esUuid(eventoId)}
                    required
                  />
                </div>

                <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
                  {loading ? "Reservando…" : "Confirmar cupo"}
                </Button>
              </form>

              {reserva ? (
                <div className="border-t border-line p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="success" dot>
                      {reserva.estado}
                    </Badge>
                    <span className="text-body-sm text-ink-muted">
                      Cupos restantes: <strong className="text-ink">{reserva.cuposRestantes}</strong>
                    </span>
                  </div>
                  <div className="mt-3 flex flex-col gap-1">
                    <span className="text-caption text-ink-subtle">ID de la reserva</span>
                    <code className="break-all font-mono text-caption text-ink">{reserva.id}</code>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => copiar(reserva.id)}
                  >
                    {copiado === reserva.id ? "¡Copiado!" : "Copiar ID de reserva"}
                  </Button>
                </div>
              ) : null}
            </Card>

            {/* Cancelar */}
            <Card>
              <div className="border-b border-line p-6 pb-4">
                <h2 className="text-title-md text-ink">Cancelar reserva</h2>
                <p className="text-body-sm text-ink-muted">
                  Solo si faltan al menos 12 horas para el inicio del evento.
                </p>
              </div>
              <form onSubmit={handleCancelar} className="flex flex-col gap-5 p-6" noValidate>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="cancelEventoId" required>
                    ID del evento
                  </Label>
                  <Input
                    id="cancelEventoId"
                    value={cancelEventoId}
                    onChange={(e) => setCancelEventoId(e.target.value)}
                    placeholder="00000000-0000-0000-0000-000000000000"
                    spellCheck={false}
                    autoCapitalize="none"
                    className="font-mono text-body-sm"
                    invalid={cancelEventoId.length > 0 && !esUuid(cancelEventoId)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="cancelReservaId" required>
                    ID de la reserva
                  </Label>
                  <Input
                    id="cancelReservaId"
                    value={cancelReservaId}
                    onChange={(e) => setCancelReservaId(e.target.value)}
                    placeholder="00000000-0000-0000-0000-000000000000"
                    spellCheck={false}
                    autoCapitalize="none"
                    className="font-mono text-body-sm"
                    invalid={cancelReservaId.length > 0 && !esUuid(cancelReservaId)}
                    required
                  />
                </div>

                <Button type="submit" variant="destructive" size="lg" className="w-full" disabled={cancelando}>
                  {cancelando ? "Cancelando…" : "Cancelar reserva"}
                </Button>
              </form>
            </Card>
          </div>
        </>
      )}
    </>
  );
}
