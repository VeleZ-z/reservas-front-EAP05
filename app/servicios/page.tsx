"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { listarServicios, crearServicio } from "@/src/api/servicios";

interface Servicio {
  id: string;
  nombre: string;
  descripcion: string;
  duracion: number;
  precio: number;
}

export default function ServiciosPage() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [nuevoServicio, setNuevoServicio] = useState({
    nombre: "",
    descripcion: "",
    duracion: 30,
    precio: 0,
  });

  useEffect(() => {
    listarServicios().then((data) => setServicios(data)).catch((err) =>
      console.error(err)
    );
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setNuevoServicio({ ...nuevoServicio, [name]: type === "number" ? parseInt(value) : value });
  };

  const handleAdd = () => {
    crearServicio(nuevoServicio).then(() => {
      listarServicios().then((data) => setServicios(data));
      setNuevoServicio({ nombre: "", descripcion: "", duracion: 30, precio: 0 });
    }).catch((err) => alert(err));
  };

  return (
    <section className="pt-24">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-[var(--color-olive-dark)] mb-6">
          Gestionar Servicios
        </h1>

        {/* Lista de servicios */}
        <Card header="Servicios Registrados">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-sm">
              <thead className="border-b border-b-[var(--color-olive-dark)]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-olive-dark)]">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-olive-dark)]">Descripción</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-olive-dark)]">Dur (min)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-olive-dark)]">Precio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-olive-dark)]">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {servicios.map((servicio) => (
                  <tr key={servicio.id} className="border-b border-b-[var(--color-olive-light)]">
                    <td className="px-6 py-4 font-medium text-[var(--color-olive-dark)]">{servicio.nombre}</td>
                    <td className="px-6 py-4 text-small text-[var(--color-olive-dark)]">{servicio.descripcion}</td>
                    <td className="px-6 py-4 text-small text-[var(--color-olive-dark)]">{servicio.duracion}</td>
                    <td className="px-6 py-4 text-small text-[var(--color-olive-dark)]">$${servicio.precio}</td>
                    <td className="px-6 py-4">
                      <Button variant="ghost" size="sm">Editar</Button>
                      <Button variant="ghost" size="sm" style={{ color: "#dc2626" }}>Eliminar</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Formulario de agregar servicio */}
        <Card header="Añadir Nuevo Servicio" className="mt-8">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-olive-dark)] mb-1">Nombre</label>
              <Input
                type="text"
                name="nombre"
                value={nuevoServicio.nombre}
                onChange={handleChange}
                placeholder="Ej: Consulta general"
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[var(--color-olive-dark)] mb-1">Descripción</label>
              <Input
                type="text"
                name="descripcion"
                value={nuevoServicio.descripcion}
                onChange={handleChange}
                placeholder="Descripción del servicio"
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[var(--color-olive-dark)] mb-1">Duración (minutos)</label>
              <Input
                type="number"
                name="duracion"
                value={String(nuevoServicio.duracion)}
                onChange={handleChange}
                placeholder="30"
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[var(--color-olive-dark)] mb-1">Precio</label>
              <Input
                type="number"
                name="precio"
                value={String(nuevoServicio.precio)}
                onChange={handleChange}
                placeholder="0"
                className="w-full"
              />
            </div>
            
            <div className="col-span-2">
              <Button type="submit" variant="primary">Añadir Servicio</Button>
              <Button variant="ghost" onClick={() => setNuevoServicio({ nombre: "", descripcion: "", duracion: 30, precio: 0 })}>
                Cancelar
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}