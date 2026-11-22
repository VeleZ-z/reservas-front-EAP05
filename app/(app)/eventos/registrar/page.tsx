"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { RequiereSesion, RolNoPermitido } from "@/components/acceso-restringido";
import { registrarEvento } from "@/src/api/eventos";
import { getSesion, type Sesion } from "@/src/api/sesion";
import { aOffsetDateTime } from "@/src/lib/fechas";

export default function EventosRegistrarPage() {
  const router = useRouter();
  const [sesion, setSesion] = useState<Sesion | null>(null);
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    inicio: "",
    fin: "",
    capacidad: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSesion(getSesion());
  }, []);

  const esAdmin = sesion?.rol === "administrador";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.nombre.trim() || !form.descripcion.trim()) {
      setError("El nombre y la descripción son obligatorios.");
      return;
    }
    const capacidad = Number(form.capacidad);
    if (!Number.isInteger(capacidad) || capacidad <= 0) {
      setError("La capacidad debe ser un número entero mayor a 0.");
      return;
    }
    if (new Date(form.fin) <= new Date(form.inicio)) {
      setError("La fecha de fin debe ser posterior a la de inicio.");
      return;
    }

    setLoading(true);
    try {
      await registrarEvento({
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim(),
        inicio: aOffsetDateTime(form.inicio),
        fin: aOffsetDateTime(form.fin),
        capacidad,
      });
      router.push("/eventos");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar el evento");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Crear evento"
        title="Registrar nuevo evento"
        description="Crea un evento para que los clientes reserven cupos."
        actions={
          <Link href="/eventos">
            <Button variant="outline">Volver a eventos</Button>
          </Link>
        }
      />

      {!sesion ? (
        <RequiereSesion descripcion="Registrar eventos requiere una cuenta de administrador." />
      ) : !esAdmin ? (
        <RolNoPermitido
          rolActual={sesion.rol}
          rolRequerido="Administrador"
          descripcion="Crear eventos requiere una cuenta de administrador."
        />
      ) : (
        <Card className="max-w-2xl p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            {error ? (
              <Alert variant="danger" title="Error al registrar">
                {error}
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
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                placeholder="Detalles del evento"
                required
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

            <div className="flex flex-col gap-2 sm:max-w-[220px]">
              <Label htmlFor="capacidad" required hint="Cupos disponibles.">
                Capacidad
              </Label>
              <Input
                id="capacidad"
                type="number"
                min={1}
                step={1}
                value={form.capacidad}
                onChange={(e) => setForm({ ...form, capacidad: e.target.value })}
                placeholder="Ej: 10"
                required
              />
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? "Creando evento…" : "Registrar evento"}
            </Button>
          </form>
        </Card>
      )}
    </>
  );
}
