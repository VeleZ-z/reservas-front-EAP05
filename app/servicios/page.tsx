"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { registrarServicio } from "@/src/api/servicios";
import { getToken } from "@/src/api/config";

export default function ServiciosPage() {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    duracionMin: 30,
    recursoId: "",
  });
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({
        ...f,
        [k]: k === "duracionMin" ? Number(e.target.value) : e.target.value,
      }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMsg(null);

    if (!getToken()) {
      setError("Debes iniciar sesión como proveedor para registrar servicios.");
      return;
    }

    setLoading(true);
    try {
      const res = await registrarServicio({
        nombre: form.nombre,
        descripcion: form.descripcion || undefined,
        duracionMin: form.duracionMin || undefined,
        recursoId: form.recursoId || undefined,
      });
      setMsg(`Servicio “${res.nombre ?? form.nombre}” registrado correctamente.`);
      setForm({ nombre: "", descripcion: "", duracionMin: 30, recursoId: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar el servicio");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Catálogo"
        title="Servicios"
        description="Define los offerings que tu negocio ofrece: nombre, duración y recurso asociado."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Formulario */}
        <Card className="lg:col-span-2">
          <div className="border-b border-line p-6 pb-4">
            <h2 className="text-title-md text-ink">Registrar servicio</h2>
            <p className="text-body-sm text-ink-muted">
              Los servicios son la base del catálogo de reservas.
            </p>
          </div>

          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
              {error ? <Alert variant="danger">{error}</Alert> : null}
              {msg ? <Alert variant="success" title="Listo">{msg}</Alert> : null}

              <div className="flex flex-col gap-2">
                <Label htmlFor="nombre" required>
                  Nombre del servicio
                </Label>
                <Input
                  id="nombre"
                  value={form.nombre}
                  onChange={set("nombre")}
                  placeholder="Corte de cabello"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="descripcion" hint="Opcional. Se muestra al cliente al reservar.">
                  Descripción
                </Label>
                <Input
                  id="descripcion"
                  value={form.descripcion}
                  onChange={set("descripcion")}
                  placeholder="Corte para hombre o mujer, incluye lavado…"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="duracionMin" required hint="Minutos que ocupa el servicio.">
                  Duración
                </Label>
                <Input
                  id="duracionMin"
                  type="number"
                  min={1}
                  value={form.duracionMin}
                  onChange={set("duracionMin")}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="recursoId" hint="UUID del recurso (silla, camilla, equipo).">
                  Recurso asociado
                </Label>
                <Input
                  id="recursoId"
                  value={form.recursoId}
                  onChange={set("recursoId")}
                  placeholder="00000000-0000-0000-0000-000000000000"
                />
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
                {loading ? "Registrando…" : "Registrar servicio"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Info / contract */}
        <Card className="lg:col-span-3">
          <div className="border-b border-line p-6 pb-4">
            <h2 className="text-title-md text-ink">Cómo funciona el catálogo</h2>
            <p className="text-body-sm text-ink-muted">
              Flujo de registro de servicios en el backend.
            </p>
          </div>
          <CardContent className="flex flex-col gap-6 p-6">
            <ol className="flex flex-col gap-4">
              {[
                {
                  t: "Registra el recurso primero",
                  d: "Cada recurso (silla, camilla, máquina) se registra por separado en /api/recursos/registrar.",
                },
                {
                  t: "Crea el servicio",
                  d: "El servicio se vincula a un recurso mediante su UUID en recursoId. La duración define el espacio que ocupa en la agenda.",
                },
                {
                  t: "Publica horarios",
                  d: "Los horarios disponibles se crean en /api/horarios indicando proveedorId, inicio y fin.",
                },
                {
                  t: "Acepta reservas",
                  d: "Cada reserva referencia un servicioId y un horarioId. El servidor valida y evita sobreocupación.",
                },
              ].map((s, i) => (
                <li key={s.t} className="flex gap-4">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-title-sm font-bold text-primary">
                    {i + 1}
                  </span>
                  <div className="flex flex-col gap-1">
                    <p className="text-title-sm text-ink">{s.t}</p>
                    <p className="text-body-sm text-ink-muted">{s.d}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="rounded-lg border border-line bg-surface-subtle p-4">
              <div className="mb-2 flex items-center gap-2">
                <Badge variant="info" dot>
                  Endpoint
                </Badge>
                <code className="font-mono text-caption text-ink">
                  POST /api/servicios/registrar
                </code>
              </div>
              <p className="text-caption text-ink-muted">
                Requiere rol <code className="font-mono">PROVEEDOR</code> o{" "}
                <code className="font-mono">ADMIN</code> y un token JWT válido.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
