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
import {
  RequiereSesion,
  RolNoPermitido,
} from "@/components/acceso-restringido";
import { registrarHorario, bloquearHorario, type Horario } from "@/src/api/horarios";
import { getSesion, type Sesion } from "@/src/api/sesion";

/** ISO local para LocalDateTime del backend: 2026-11-20T09:00:00 */
function aLocalDateTime(valor: string): string | null {
  if (!valor) return null;
  // `<input type="datetime-local">` entrega "YYYY-MM-DDTHH:mm"
  const normalizado = valor.trim();
  if (!normalizado) return null;
  return `${normalizado}:00`;
}

export default function HorariosPage() {
  const [sesion, setSesion] = useState<Sesion | null>(null);
  const [inicio, setInicio] = useState("");
  const [fin, setFin] = useState("");
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [bloqueando, setBloqueando] = useState<string | null>(null);

  useEffect(() => {
    setSesion(getSesion());
  }, []);

  /** Carga los horarios creados en esta pestaña. */
  function agregarLocal(h: Horario) {
    setHorarios((prev) => [h, ...prev]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMsg(null);

    if (!sesion || sesion.rol !== "proveedor") {
      setError("Publicar horarios requiere una cuenta de proveedor.");
      return;
    }

    const inicioIso = aLocalDateTime(inicio);
    const finIso = aLocalDateTime(fin);

    if (!inicioIso || !finIso) {
      setError("Indica la fecha y hora de inicio y de fin del bloque.");
      return;
    }
    if (new Date(finIso) <= new Date(inicioIso)) {
      setError("La hora de fin debe ser posterior a la de inicio.");
      return;
    }

    setLoading(true);
    try {
      const res = await registrarHorario({ inicio: inicioIso, fin: finIso });
      agregarLocal(res);
      setMsg(
        `Horario publicado: ${new Date(res.inicio).toLocaleString("es-CO", {
          dateStyle: "medium",
          timeStyle: "short",
        })}.`
      );
      setInicio("");
      setFin("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo publicar el horario"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleBloquear(id: string) {
    setError(null);
    setMsg(null);
    setBloqueando(id);
    try {
      const res = await bloquearHorario(id);
      setHorarios((prev) =>
        prev.map((h) => (h.id === id ? { ...h, estado: res.estado ?? h.estado } : h))
      );
      setMsg("Horario bloqueado; ya no aceptará reservas nuevas.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo bloquear el horario"
      );
    } finally {
      setBloqueando(null);
    }
  }

  const esProveedor = sesion?.rol === "proveedor";

  return (
    <>
      <PageHeader
        eyebrow="Operación"
        title="Horarios disponibles"
        description="Publica bloques horarios para que tus clientes puedan reservarlos."
      />

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

      {!sesion ? (
        <RequiereSesion descripcion="Los horarios se asocian automáticamente a tu cuenta de proveedor." />
      ) : !esProveedor ? (
        <RolNoPermitido
          rolActual={sesion.rol}
          rolRequerido="Proveedor"
          descripcion="Publicar horarios requiere una cuenta de proveedor."
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Formulario */}
        <Card className="lg:col-span-2">
          <div className="border-b border-line p-6 pb-4">
            <h2 className="text-title-md text-ink">Nuevo bloque</h2>
            <p className="text-body-sm text-ink-muted">
              El ID del proveedor se toma de tu sesión.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6" noValidate>
            <div className="flex flex-col gap-2">
              <Label htmlFor="inicio" required>
                Fecha y hora de inicio
              </Label>
              <Input
                id="inicio"
                type="datetime-local"
                value={inicio}
                onChange={(e) => setInicio(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="fin" required>
                Fecha y hora de fin
              </Label>
              <Input
                id="fin"
                type="datetime-local"
                value={fin}
                onChange={(e) => setFin(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={loading || !esProveedor}
            >
              {loading ? "Publicando…" : "Publicar horario"}
            </Button>

            <p className="text-caption text-ink-subtle">
              El backend recibe las fechas en formato ISO local (
              <code className="font-mono">YYYY-MM-DDTHH:mm:ss</code>).
            </p>
          </form>
        </Card>

        {/* Listado */}
        <Card className="lg:col-span-3">
          <div className="flex items-center justify-between border-b border-line p-6 pb-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-title-md text-ink">
                Publicados en esta sesión
              </h2>
              <p className="text-body-sm text-ink-muted">
                {horarios.length} bloque{horarios.length === 1 ? "" : "s"} creado
                {horarios.length === 1 ? "" : "s"}
              </p>
            </div>
            <Link href="/agenda">
              <Button variant="ghost" size="sm">
                Ver agenda
              </Button>
            </Link>
          </div>

          {horarios.length === 0 ? (
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
              title="Sin horarios publicados"
              description="Los bloques que crees aparecerán aquí con su ID, listos para compartir con tus clientes."
            />
          ) : (
            <ul className="flex flex-col divide-y divide-line">
              {horarios.map((h) => (
                <li
                  key={h.id}
                  className="flex flex-wrap items-center justify-between gap-4 px-6 py-4"
                >
                  <div className="flex min-w-0 flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={h.estado === "BLOQUEADO" ? "danger" : "success"}
                        dot
                      >
                        {h.estado ?? "DISPONIBLE"}
                      </Badge>
                      <span className="text-body-sm font-medium text-ink">
                        {new Date(h.inicio).toLocaleString("es-CO", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                        {" → "}
                        {new Date(h.fin).toLocaleTimeString("es-CO", {
                          timeStyle: "short",
                        })}
                      </span>
                    </div>
                    <code className="truncate font-mono text-caption text-ink-subtle">
                      {h.id}
                    </code>
                  </div>
                  {h.estado !== "BLOQUEADO" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={bloqueando === h.id}
                      onClick={() => handleBloquear(h.id)}
                    >
                      {bloqueando === h.id ? "Bloqueando…" : "Bloquear"}
                    </Button>
                  ) : (
                    <span className="text-caption text-ink-subtle">Bloqueado</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
      )}
    </>
  );
}
