"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Alert } from "@/components/ui/alert";
import { SkeletonTable, EmptyState } from "@/components/ui/feedback";
import { consultarAgenda, type AgendaItem } from "@/src/api/agenda";
import { getToken } from "@/src/api/config";

type Filtro = "todas" | "CONFIRMADA" | "PENDIENTE" | "CANCELADA";

export default function AgendaPage() {
  const [items, setItems] = useState<AgendaItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<Filtro>("todas");
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    if (!getToken()) {
      setItems([]);
      return;
    }
    consultarAgenda()
      .then(setItems)
      .catch((e) => {
        setError(e instanceof Error ? e.message : "No se pudo cargar la agenda");
        setItems([]);
      });
  }, []);

  const filtrados = useMemo(() => {
    if (!items) return [];
    const q = busqueda.trim().toLowerCase();
    return items.filter((i) => {
      const coincideEstado = filtro === "todas" || i.estado === filtro;
      const coincideTexto =
        !q ||
        i.id.toLowerCase().includes(q) ||
        (i.servicioId ?? "").toLowerCase().includes(q) ||
        (i.clienteId ?? "").toLowerCase().includes(q);
      return coincideEstado && coincideTexto;
    });
  }, [items, filtro, busqueda]);

  const badgeVariant = (estado: string) =>
    estado === "CONFIRMADA" ? "success" : estado === "CANCELADA" ? "danger" : "warning";

  return (
    <>
      <PageHeader
        eyebrow="Operación"
        title="Agenda de reservas"
        description="Consulta el histórico completo de reservas, filtra por estado y busca por identificador."
        actions={
          <Link href="/reservas">
            <Button variant="primary">Nueva reserva</Button>
          </Link>
        }
      />

      {error ? (
        <Alert variant="danger" title="Error al cargar" className="mb-6">
          {error}
        </Alert>
      ) : null}

      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <div className="flex flex-col gap-2">
            <Label htmlFor="q">Buscar</Label>
            <Input
              id="q"
              placeholder="ID de reserva, servicio o cliente…"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2 sm:w-56">
            <Label htmlFor="filtro">Estado</Label>
            <Select
              id="filtro"
              value={filtro}
              onValueChange={(v) => setFiltro(v as Filtro)}
              options={[
                { value: "todas", label: "Todas las reservas" },
                { value: "CONFIRMADA", label: "Confirmadas" },
                { value: "PENDIENTE", label: "Pendientes" },
                { value: "CANCELADA", label: "Canceladas" },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabla */}
      <Card>
        <div className="flex items-center justify-between border-b border-line p-6 pb-4">
          <div>
            <h2 className="text-title-md text-ink">
              {items ? `${filtrados.length} reserva${filtrados.length === 1 ? "" : "s"}` : "Cargando…"}
            </h2>
            <p className="text-body-sm text-ink-muted">Ordenadas por fecha de creación</p>
          </div>
        </div>

        {items === null ? (
          <SkeletonTable rows={6} cols={5} />
        ) : filtrados.length === 0 ? (
          <EmptyState
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="size-6">
                <rect width="18" height="18" x="3" y="4" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
            }
            title={items.length === 0 ? "Sin reservas registradas" : "Sin resultados"}
            description={
              items.length === 0
                ? "Cuando se creen reservas aparecerán aquí automáticamente."
                : "Prueba con otro término de búsqueda o cambia el filtro de estado."
            }
            action={
              items.length === 0 ? (
                <Link href="/reservas">
                  <Button variant="primary">Crear reserva</Button>
                </Link>
              ) : null
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Servicio</th>
                  <th scope="col">Cliente</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Creada</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((r) => (
                  <tr key={r.id}>
                    <td className="font-mono text-caption text-ink">{r.id.slice(0, 8)}</td>
                    <td className="font-mono text-caption">{r.servicioId?.slice(0, 8)}</td>
                    <td className="font-mono text-caption">{r.clienteId?.slice(0, 8)}</td>
                    <td>
                      <Badge variant={badgeVariant(r.estado)} dot>
                        {r.estado}
                      </Badge>
                    </td>
                    <td className="text-caption">
                      {new Date(r.creadaEn).toLocaleString("es-CO", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
