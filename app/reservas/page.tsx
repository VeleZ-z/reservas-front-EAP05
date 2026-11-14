"use client";

import { useState, useEffect } from "react";
import { Reserva } from "@/src/api/reservas";
import { ReservaForm } from "@/components/ReservaForm";
import { listarReservas, cancelarReserva, crearReserva } from "@/src/api/reservas";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ReservasPage() {
  const [reservas, setReservas] = useState<Reserva[]>([]);

  useEffect(() => {
    listarReservas().then((data) => setReservas(data)).catch((err) =>
      console.error(err)
    );
  }, []);

  const handleSubmit = (reserva: {
    servicioId: string;
    recursoId: string;
    fecha: string;
    hora: string;
    usuario: string;
  }) => {
    crearReserva({
      servicioId: reserva.servicioId,
      recursoId: reserva.recursoId,
      fecha: reserva.fecha,
      hora: reserva.hora,
      usuario: reserva.usuario,
    }).then(() => {
      listarReservas().then((data) => setReservas(data));
    });
  };

  return (
    <section className="pt-24">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-[var(--color-olive-dark)] mb-6">
          Gestión de Reservas
        </h1>

        {/* Formulario de creación */}
        <Card header="Crear Nueva Reserva">
          <ReservaForm onReservaCreated={handleSubmit} />
        </Card>

        {/* Lista de reservas */}
        <Card header="Reservas Registradas" className="mt-8">
          <div className="px-6 py-5">
            <table className="min-w-full bg-white rounded-lg shadow-sm">
              <thead className="border-b border-b-[var(--color-olive-dark)]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-olive-dark)]">Servicio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-olive-dark)]">Recurso</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-olive-dark)]">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-olive-dark)]">Hora</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-olive-dark)]">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-olive-dark)]">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {reservas.map((reserva) => (
                  <tr key={reserva.id} className="border-b border-b-[var(--color-olive-light)]">
                    <td className="px-6 py-4 font-medium text-[var(--color-olive-dark)]">{reserva.servicioId}</td>
                    <td className="px-6 py-4 text-small text-[var(--color-olive-dark)]">{reserva.recursoId}</td>
                    <td className="px-6 py-4 text-small text-[var(--color-olive-dark)]">{reserva.fecha}</td>
                    <td className="px-6 py-4 text-small text-[var(--color-olive-dark)]">{reserva.hora}</td>
                    <td className="px-6 py-4">
                      <span
                        className={
                          reserva.estado === "pendiente"
                            ? "bg-[var(--color-sage-green)] text-white rounded px-2 py-1 text-xs"
                            : reserva.estado === "confirmada"
                            ? "bg-[var(--color-olive-dark)] text-white rounded px-2 py-1 text-xs"
                            : "bg-[var(--color-bronze)] text-white rounded px-2 py-1 text-xs"
                        }
                      >
                        {reserva.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Button variant="ghost" size="sm">Ver</Button>
                      <Button variant="ghost" size="sm" style={{ color: "#dc2626" }}>
                        Cancelar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </section>
  );
}