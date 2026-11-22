"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { registrarEvento } from "@/src/api/eventos";
import { getSesion, type Sesion } from "@/src/api/sesion";

export default function EventosRegistrarPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    inicio: "",
    fin: "",
    capacidad: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const sesion = getSesion();

  const esAdmin = sesion?.rol === "administrador";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const payload = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        inicio: form.inicio,
        fin: form.fin,
        capacidad: parseInt(form.capacidad),
      };
      
      await registrarEvento(payload);
      router.push("/eventos");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar el evento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Crear evento"
        title="Registrar nuevo evento"
        description="Crea un evento para que los clientes reserven cupos."
      />

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <Alert variant="danger" title="Error al registrar">
              {error}
            </Alert>
          )}

          <div className="flex flex-col gap-4">
            <div>
              <Label htmlFor="nombre" required>
                Nombre del evento
              </Label>
              <Input
                id="nombre"
                autoComplete="name"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                placeholder="Ej: Día de campo anual"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="descripcion" required>
                Descripción
              </Label>
              <Input
                id="descripcion"
                autoComplete="description"
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                placeholder="Detalles del evento"
              />
            </div>

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

            <div className="flex flex-col gap-2">
              <Label htmlFor="capacidad" required>
                Capacidad
              </Label>
              <Input
                id="capacidad"
                type="number"
                min={1}
                value={form.capacidad}
                onChange={(e) => setForm({ ...form, capacidad: e.target.value })}
                placeholder="Ej: 10"
              />
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? "Creando evento…" : "Registrar evento"}
            </Button>
          </div>
        </form>
      </Card>
    </>
  );
}