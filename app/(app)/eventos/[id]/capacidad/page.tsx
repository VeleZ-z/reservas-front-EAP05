"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { definirCapacidadEvento } from "@/src/api/eventos";
import { getSesion, type Sesion } from "@/src/api/sesion";

export default function EventoCapacidadPage() {
  const params = useParams();
  const id = params.id as string;
  const [capacidad, setCapacidad] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [exito, setExito] = useState(false);
  const sesion = getSesion();
  const esAdmin = sesion?.rol === "administrador";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      await definirCapacidadEvento(id, { capacidad: parseInt(capacidad) });
      setExito(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo actualizar la capacidad");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Evento"
        title="Modificar capacidad"
        description="Cambia la capacidad máxima del evento. No puede ser menor a las reservas confirmadas existentes."
      />

      <Card className="p-6 max-w-md">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <Alert variant="danger" title="Error al actualizar">
              {error}
            </Alert>
          )}

          {exito && (
            <Alert variant="success" title="Capacidad actualizada">
              La capacidad del evento ha sido modificada correctamente.
            </Alert>
          )}

          <div>
            <Label htmlFor="capacidad" required>
              Nueva capacidad
            </Label>
            <Input
              id="capacidad"
              type="number"
              min={1}
              value={capacidad}
              onChange={(e) => setCapacidad(e.target.value)}
              placeholder="Ej: 20"
              required
            />
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={loading || exito}>
            {loading ? "Actualizando…" : "Guardar capacidad"}
          </Button>
        </form>
      </Card>
    </>
  );
}