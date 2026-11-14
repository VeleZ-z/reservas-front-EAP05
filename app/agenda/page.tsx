"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

interface Horario {
  id: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  disponible: boolean;
}

export default function AgendaPage() {
  const [horarios, setHorarios] = useState<Horario[]>([
    { id: "1", fecha: "2024-01-15", horaInicio: "09:00", horaFin: "10:00", disponible: true },
    { id: "2", fecha: "2024-01-15", horaInicio: "10:00", horaFin: "11:00", disponible: true },
    { id: "3", fecha: "2024-01-15", horaInicio: "11:00", horaFin: "12:00", disponible: false },
    { id: "4", fecha: "2024-01-16", horaInicio: "09:00", horaFin: "10:00", disponible: true },
    { id: "5", fecha: "2024-01-16", horaInicio: "14:00", horaFin: "15:00", disponible: true },
  ]);

  const [fecha, setFecha] = useState("2024-01-15");

  const handleChangeFecha = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFecha(e.target.value);
  };

  return (
    <section className="pt-24">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-[var(--color-olive-dark)] mb-6">
          Gestión de Horarios y Agenda
        </h1>

        <div className="mb-8 rounded-lg border border-[var(--color-olive-dark)] overflow-hidden">
          <div className="grid grid-cols-2 gap-4 p-4 border-b border-b-[var(--color-olive-dark)]">
            <div>
              <label className="block text-sm font-medium text-[var(--color-olive-dark)] mb-1">
                Fecha
              </label>
              <Input
                type="date"
                value={fecha}
                onChange={handleChangeFecha}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[var(--color-olive-dark)] mb-1">
                Mostrar
              </label>
              <Select
                defaultValue="todos"
                options={[
                  { value: "todos", label: "Todos" },
                  { value: "disponibles", label: "Disponibles" },
                  { value: "ocupados", label: "Ocupados" },
                ]}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-sm">
            <thead className="border-b border-b-[var(--color-olive-dark)]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-olive-dark)]">Hora</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-olive-dark)]">Disponible</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-olive-dark)]">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {horarios
                .filter((h) => h.fecha === fecha)
                .map((h) => (
                  <tr key={h.id} className="border-b border-b-[var(--color-olive-light)]">
                    <td className="px-6 py-4 font-medium text-[var(--color-olive-dark)]">
                      {h.horaInicio} - {h.horaFin}
                    </td>
                    <td className="px-6 py-4">
                      <span 
                        className={h.disponible 
                          ? "bg-[var(--color-sage-green)] text-white rounded px-2 py-1 text-xs"
                          : "bg-[var(--color-bronze)] text-white rounded px-2 py-1 text-xs"}
                      >
                        {h.disponible ? "Disponible" : "Reservado"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Button 
                        variant={h.disponible ? "ghost" : "secondary"} 
                        size="sm"
                        onClick={() => console.log('Cambiar disponibilidad', h.id)}
                      >
                        {h.disponible ? "Reservar" : "Cancelar"}
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
