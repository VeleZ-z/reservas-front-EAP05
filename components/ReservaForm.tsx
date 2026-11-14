"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ReservaFormProps {
  onReservaCreated: (reserva: {
    servicioId: string;
    recursoId: string;
    fecha: string;
    hora: string;
    usuario: string;
  }) => void;
}

export function ReservaForm({ onReservaCreated }: ReservaFormProps) {
  const [formData, setFormData] = useState({
    servicio: "",
    recurso: "",
    fecha: "",
    hora: "",
    usuario: "",
  });

  const [servicios, setServicios] = useState<Array<{ value: string; label: string }>>([
    { value: "servicio-1", label: "Cortes de cabello" },
    { value: "servicio-2", label: "Manicura" },
    { value: "servicio-3", label: "Masaje" },
  ]);

  const [recursos, setRecursos] = useState<Array<{ value: string; label: string }>>([
    { value: "recurso-1", label: "Silla de estilista" },
    { value: "recurso-2", label: "Mesa de manicura" },
    { value: "recurso-3", label: "Camilla de masaje" },
  ]);

  const [usuarios, setUsuarios] = useState<Array<{ value: string; label: string }>>([
    { value: "usuario-1", label: "María G." },
    { value: "usuario-2", label: "José L." },
    { value: "usuario-3", label: "Ana M." },
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({ ...formData, [name]: type === "date" ? value : value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onReservaCreated({
      servicioId: formData.servicio,
      recursoId: formData.recurso,
      fecha: formData.fecha,
      hora: formData.hora,
      usuario: formData.usuario,
    });
    setFormData({
      servicio: "",
      recurso: "",
      fecha: "",
      hora: "",
      usuario: "",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crear Nueva Reserva</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-olive-dark mb-1">
                Servicio
              </label>
              <Select
                onValueChange={(value) => setFormData({ ...formData, servicio: value })}
                defaultValue=""
                options={servicios}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-olive-dark mb-1">
                Recurso
              </label>
              <Select
                onValueChange={(value) => setFormData({ ...formData, recurso: value })}
                defaultValue=""
                options={recursos}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-olive-dark mb-1">
              Usuario
            </label>
            <Select
              onValueChange={(value) => setFormData({ ...formData, usuario: value })}
              defaultValue=""
              options={usuarios}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-olive-dark mb-1">
              Fecha
            </label>
            <Input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              placeholder="Seleccionar fecha"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-olive-dark mb-1">
              Hora
            </label>
            <Input
              type="time"
              name="hora"
              value={formData.hora}
              onChange={handleChange}
              placeholder="Seleccionar hora"
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" variant="primary">Crear Reserva</Button>
            <Button variant="ghost" onClick={() => setFormData({ servicio: "", recurso: "", fecha: "", hora: "", usuario: "" })}>
              Limpiar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}