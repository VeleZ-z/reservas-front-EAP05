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
import { definirCapacidadEvento } from "@/src/api/eventos";
import { getSesion, type Sesion } from "@/src/api/sesion";

export default function EventoCapacidadPage() {
  const params = useParams();
  const id = String(params.id ?? "");
  const [sesion, setSesion] = useState<Sesion | null>(null);
  const [capacidad, setCapacidad] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [exito, setExito] = useState(false);

  useEffect(() => {
    setSesion(getSesion());
  }, []);

  const esAdmin = sesion?.rol === "administrador";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const valor = Number(capacidad);
    if (!Number.isInteger(valor) || valor <= 0) {
      setError("La capacidad debe ser un número entero mayor a 0.");
      return;
    }

    setLoading(true);
    try {
      await definirCapacidadEvento(id, { capacidad: valor });
      setExito(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo actualizar la capacidad");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Evento"
        title="Modificar capacidad"
        description="Cambia la capacidad máxima del evento. No puede ser menor a las reservas confirmadas existentes."
        actions={
          <Link href="/eventos">
            <Button variant="outline">Volver a eventos</Button>
          </Link>
        }
      />

      {!sesion ? (
        <RequiereSesion descripcion="Modificar la capacidad requiere una cuenta de administrador." />
      ) : !esAdmin ? (
        <RolNoPermitido
          rolActual={sesion.rol}
          rolRequerido="Administrador"
          descripcion="Modificar la capacidad de un evento requiere una cuenta de administrador."
        />
      ) : (
        <Card className="max-w-md p-6">
          <p className="mb-4 text-caption text-ink-subtle">
            Evento: <code className="font-mono">{id}</code>
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            {error ? (
              <Alert variant="danger" title="Error al actualizar">
                {error}
              </Alert>
            ) : null}

            {exito ? (
              <Alert variant="success" title="Capacidad actualizada">
                La capacidad del evento ha sido modificada correctamente.
              </Alert>
            ) : null}

            <div className="flex flex-col gap-2">
              <Label htmlFor="capacidad" required hint="Debe cubrir las reservas confirmadas.">
                Nueva capacidad
              </Label>
              <Input
                id="capacidad"
                type="number"
                min={1}
                step={1}
                value={capacidad}
                onChange={(e) => setCapacidad(e.target.value)}
                placeholder="Ej: 20"
                required
              />
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? "Actualizando…" : "Guardar capacidad"}
            </Button>
          </form>
        </Card>
      )}
    </>
  );
}
