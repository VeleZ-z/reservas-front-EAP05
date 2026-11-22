"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { RequiereSesion, RolNoPermitido } from "@/components/acceso-restringido";
import { actualizarEvento } from "@/src/api/eventos";
import { getSesion, type Sesion } from "@/src/api/sesion";
import { aOffsetDateTime } from "@/src/lib/fechas";

export default function EventoActualizarPage() {
  const params = useParams();
  const id = String(params.id ?? "");
  const [sesion, setSesion] = useState<Sesion | null>(null);
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    inicio: "",
    fin: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSesion(getSesion());
  }, []);

  const esAdmin = sesion?.rol === "administrador";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMsg(null);

    if (!form.nombre.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }
    if (new Date(form.fin) <= new Date(form.inicio)) {
      setError("La fecha de fin debe ser posterior a la de inicio.");
      return;
    }

    setLoading(true);
    try {
      await actualizarEvento(id, {
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim() || undefined,
        inicio: aOffsetDateTime(form.inicio),
        fin: aOffsetDateTime(form.fin),
      });
      setMsg("Evento actualizado correctamente.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo actualizar el evento");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Evento"
        title="Actualizar evento"
        description="Modifica nombre, descripción y fechas del evento."
        actions={
          <Link href="/eventos">
            <Button variant="outline">Volver a eventos</Button>
          </Link>
        }
      />

      {!sesion ? (
        <RequiereSesion descripcion="Actualizar eventos requiere una cuenta de administrador." />
      ) : !esAdmin ? (
        <RolNoPermitido
          rolActual={sesion.rol}
          rolRequerido="Administrador"
          descripcion="Actualizar eventos requiere una cuenta de administrador."
        />
      ) : (
        <Card className="max-w-2xl p-6">
          <p className="mb-4 text-caption text-ink-subtle">
            Evento: <code className="font-mono">{id}</code>
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            {error ? (
              <Alert variant="danger" title="Error al actualizar">
                {error}
              </Alert>
            ) : null}
            {msg ? (
              <Alert variant="success" title="Operación completada">
                {msg}
              </Alert>
            ) : null}

            <div className="flex flex-col gap-2">
              <Label htmlFor="nombre" required>
                Nombre del evento
              </Label>
              <Input
                id="nombre"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Input
                id="descripcion"
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="inicio" required>
                  Fecha de inicio
                </Label>
                <Input
                  id="inicio"
                  type="datetime-local"
                  value={form.inicio}
                  onChange={(e) => setForm({ ...form, inicio: e.target.value })}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="fin" required>
                  Fecha de fin
                </Label>
                <Input
                  id="fin"
                  type="datetime-local"
                  value={form.fin}
                  onChange={(e) => setForm({ ...form, fin: e.target.value })}
                  required
                />
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? "Guardando…" : "Guardar cambios"}
            </Button>
          </form>
        </Card>
      )}
    </>
  );
}
