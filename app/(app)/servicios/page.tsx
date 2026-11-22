"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  RequiereSesion,
  RolNoPermitido,
} from "@/components/acceso-restringido";
import { registrarServicio } from "@/src/api/servicios";
import { registrarRecurso } from "@/src/api/recursos";
import { asignarProveedor } from "@/src/api/proveedor-servicio";
import { getSesion, type Sesion } from "@/src/api/sesion";
import { esUuid } from "@/src/lib/validaciones";

type Tab = "servicio" | "recurso" | "asignacion";

interface Registro {
  id: string;
  titulo: string;
  detalle: string;
  tipo: "servicio" | "recurso" | "asignacion";
}

export default function ServiciosPage() {
  const [sesion, setSesion] = useState<Sesion | null>(null);
  const [tab, setTab] = useState<Tab>("servicio");
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiado, setCopiado] = useState<string | null>(null);
  const [registros, setRegistros] = useState<Registro[]>([]);

  const [servicio, setServicio] = useState({
    nombre: "",
    descripcion: "",
    duracionMin: 30,
    recursoId: "",
  });
  const [recurso, setRecurso] = useState({ nombre: "", descripcion: "" });
  const [asignacion, setAsignacion] = useState({
    servicioId: "",
    proveedorId: "",
  });

  useEffect(() => {
    setSesion(getSesion());
  }, []);

  function setServicioField(k: keyof typeof servicio) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setServicio((s) => ({
        ...s,
        [k]: k === "duracionMin" ? Number(e.target.value) : e.target.value,
      }));
  }

  async function handleServicio(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMsg(null);
    setLoading(true);
    try {
      const res = await registrarServicio({
        nombre: servicio.nombre,
        descripcion: servicio.descripcion || undefined,
        duracionMin: servicio.duracionMin || undefined,
        recursoId: servicio.recursoId || undefined,
      });
      setRegistros((r) => [
        {
          id: res.id,
          titulo: res.nombre ?? servicio.nombre,
          detalle: `${res.duracionMin ?? servicio.duracionMin} min`,
          tipo: "servicio",
        },
        ...r,
      ]);
      setMsg(`Servicio “${res.nombre ?? servicio.nombre}” registrado.`);
      setServicio({ nombre: "", descripcion: "", duracionMin: 30, recursoId: "" });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo registrar el servicio"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleRecurso(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMsg(null);
    setLoading(true);
    try {
      const res = await registrarRecurso(recurso);
      setRegistros((r) => [
        {
          id: res.id,
          titulo: res.nombre ?? recurso.nombre,
          detalle: "Recurso activo",
          tipo: "recurso",
        },
        ...r,
      ]);
      setMsg(`Recurso “${res.nombre ?? recurso.nombre}” registrado.`);
      setRecurso({ nombre: "", descripcion: "" });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo registrar el recurso"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleAsignacion(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMsg(null);
    if (!esUuid(asignacion.servicioId)) {
      setError("El ID del servicio no tiene un formato UUID válido.");
      return;
    }
    if (!esUuid(asignacion.proveedorId)) {
      setError("El ID del proveedor no tiene un formato UUID válido.");
      return;
    }
    setLoading(true);
    try {
      const res = await asignarProveedor({
        servicioId: asignacion.servicioId.trim(),
        proveedorId: asignacion.proveedorId.trim(),
      });
      setRegistros((r) => [
        {
          id: res.id ?? `${asignacion.servicioId}-${asignacion.proveedorId}`,
          titulo: "Proveedor asignado",
          detalle: `Servicio ${asignacion.servicioId.slice(0, 8)}`,
          tipo: "asignacion",
        },
        ...r,
      ]);
      setMsg("Proveedor asignado al servicio correctamente.");
      setAsignacion({ servicioId: "", proveedorId: "" });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo asignar el proveedor"
      );
    } finally {
      setLoading(false);
    }
  }

  async function copiar(texto: string) {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(texto);
      window.setTimeout(() => setCopiado(null), 1800);
    } catch {
      setError("No se pudo copiar al portapapeles.");
    }
  }

  const esAdmin = sesion?.rol === "administrador";

  const TABS: { id: Tab; label: string }[] = [
    { id: "servicio", label: "Servicio" },
    { id: "recurso", label: "Recurso" },
    { id: "asignacion", label: "Asignación" },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Catálogo"
        title="Servicios y recursos"
        description="Define los offerings del negocio y relaciónalos con los proveedores que los atienden."
      />

      {error ? (
        <Alert variant="danger" title="No se pudo completar la operación" className="mb-6">
          {error}
        </Alert>
      ) : null}
      {msg ? (
        <Alert variant="success" title="Operación completada" className="mb-6">
          {msg}
        </Alert>
      ) : null}

      {!sesion ? (
        <RequiereSesion descripcion="El catálogo se administra con el rol Administrador." />
      ) : !esAdmin ? (
        <RolNoPermitido
          rolActual={sesion.rol}
          rolRequerido="Administrador"
          descripcion="Gestionar servicios y recursos requiere una cuenta de administrador."
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          {/* Tabs */}
          <div
            role="tablist"
            aria-label="Operaciones del catálogo"
            className="flex gap-1 border-b border-line p-2"
          >
            {TABS.map((t) => (
              <button
                key={t.id}
                role="tab"
                type="button"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 rounded-md px-3 py-2 text-body-sm font-semibold transition-colors ${
                  tab === t.id
                    ? "bg-primary-soft text-ink-brand"
                    : "text-ink-muted hover:bg-surface-subtle hover:text-ink"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {tab === "servicio" ? (
              <form onSubmit={handleServicio} className="flex flex-col gap-5" noValidate>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="nombre" required>
                    Nombre del servicio
                  </Label>
                  <Input
                    id="nombre"
                    value={servicio.nombre}
                    onChange={setServicioField("nombre")}
                    placeholder="Corte de cabello"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="descripcion"
                    hint="Opcional. Se muestra al cliente al reservar."
                  >
                    Descripción
                  </Label>
                  <Input
                    id="descripcion"
                    value={servicio.descripcion}
                    onChange={setServicioField("descripcion")}
                    placeholder="Incluye lavado y peinado"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="duracionMin" required hint="Minutos que ocupa.">
                    Duración
                  </Label>
                  <Input
                    id="duracionMin"
                    type="number"
                    min={1}
                    value={servicio.duracionMin}
                    onChange={setServicioField("duracionMin")}
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="recursoId"
                    hint="UUID del recurso (silla, camilla, equipo)."
                  >
                    Recurso asociado
                  </Label>
                  <Input
                    id="recursoId"
                    value={servicio.recursoId}
                    onChange={setServicioField("recursoId")}
                    placeholder="00000000-0000-0000-0000-000000000000"
                    spellCheck={false}
                    autoCapitalize="none"
                    className="font-mono text-body-sm"
                    invalid={
                      servicio.recursoId.length > 0 &&
                      !esUuid(servicio.recursoId)
                    }
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={loading || !esAdmin}
                >
                  {loading ? "Registrando…" : "Registrar servicio"}
                </Button>
              </form>
            ) : null}

            {tab === "recurso" ? (
              <form onSubmit={handleRecurso} className="flex flex-col gap-5" noValidate>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="recursoNombre" required>
                    Nombre del recurso
                  </Label>
                  <Input
                    id="recursoNombre"
                    value={recurso.nombre}
                    onChange={(e) =>
                      setRecurso((r) => ({ ...r, nombre: e.target.value }))
                    }
                    placeholder="Silla 01"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="recursoDescripcion" required>
                    Descripción
                  </Label>
                  <Input
                    id="recursoDescripcion"
                    value={recurso.descripcion}
                    onChange={(e) =>
                      setRecurso((r) => ({ ...r, descripcion: e.target.value }))
                    }
                    placeholder="Silla de Vijay van Praag — cabine 2"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={loading || !esAdmin}
                >
                  {loading ? "Registrando…" : "Registrar recurso"}
                </Button>
              </form>
            ) : null}

            {tab === "asignacion" ? (
              <form
                onSubmit={handleAsignacion}
                className="flex flex-col gap-5"
                noValidate
              >
                <div className="flex flex-col gap-2">
                  <Label htmlFor="servicioId" required>
                    ID del servicio
                  </Label>
                  <Input
                    id="servicioId"
                    value={asignacion.servicioId}
                    onChange={(e) =>
                      setAsignacion((a) => ({
                        ...a,
                        servicioId: e.target.value,
                      }))
                    }
                    placeholder="00000000-0000-0000-0000-000000000000"
                    spellCheck={false}
                    autoCapitalize="none"
                    className="font-mono text-body-sm"
                    invalid={
                      asignacion.servicioId.length > 0 &&
                      !esUuid(asignacion.servicioId)
                    }
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="proveedorId" required>
                    ID del proveedor
                  </Label>
                  <Input
                    id="proveedorId"
                    value={asignacion.proveedorId}
                    onChange={(e) =>
                      setAsignacion((a) => ({
                        ...a,
                        proveedorId: e.target.value,
                      }))
                    }
                    placeholder="00000000-0000-0000-0000-000000000000"
                    spellCheck={false}
                    autoCapitalize="none"
                    className="font-mono text-body-sm"
                    invalid={
                      asignacion.proveedorId.length > 0 &&
                      !esUuid(asignacion.proveedorId)
                    }
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={loading || !esAdmin}
                >
                  {loading ? "Asignando…" : "Asignar proveedor"}
                </Button>
              </form>
            ) : null}
          </div>
        </Card>

        {/* Registros creados + guía */}
        <div className="flex flex-col gap-6 lg:col-span-3">
          {registros.length > 0 ? (
            <Card>
              <div className="border-b border-line p-6 pb-4">
                <h2 className="text-title-md text-ink">Creados en esta sesión</h2>
                <p className="text-body-sm text-ink-muted">
                  Copia los UUID para usarlos en los formularios de servicios,
                  horarios y reservas.
                </p>
              </div>
              <ul className="flex flex-col divide-y divide-line">
                {registros.map((r, i) => (
                  <li
                    key={`${r.id}-${i}`}
                    className="flex flex-wrap items-center justify-between gap-3 px-6 py-4"
                  >
                    <div className="flex min-w-0 flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            r.tipo === "servicio"
                              ? "primary"
                              : r.tipo === "recurso"
                                ? "info"
                                : "success"
                          }
                        >
                          {r.tipo}
                        </Badge>
                        <span className="text-body-sm font-semibold text-ink">
                          {r.titulo}
                        </span>
                      </div>
                      <code className="truncate font-mono text-caption text-ink-subtle">
                        {r.id}
                      </code>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copiar(r.id)}
                    >
                      {copiado === r.id ? "¡Copiado!" : "Copiar ID"}
                    </Button>
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}

          <Card>
            <div className="border-b border-line p-6 pb-4">
              <h2 className="text-title-md text-ink">Flujo del catálogo</h2>
              <p className="text-body-sm text-ink-muted">
                Orden de configuración y permisos de cada endpoint.
              </p>
            </div>
            <div className="flex flex-col gap-6 p-6">
              <ol className="flex flex-col gap-4">
                {[
                  {
                    t: "Registra el recurso primero",
                    d: "Sillas, camillas o equipos se crean en /api/recursos/registrar.",
                    rol: "Administrador",
                  },
                  {
                    t: "Crea el servicio",
                    d: "Se vincula a un recurso mediante su UUID en recursoId. La duración define el espacio en la agenda.",
                    rol: "Administrador",
                  },
                  {
                    t: "Asigna el proveedor",
                    d: "Relaciona el servicio con el UUID del usuario que lo atenderá.",
                    rol: "Administrador",
                  },
                  {
                    t: "Publica horarios",
                    d: "El proveedor crea sus bloques disponibles en /api/horarios indicando inicio y fin.",
                    rol: "Proveedor",
                  },
                  {
                    t: "Acepta reservas",
                    d: "Cada reserva referencia un servicioId y un horarioId. El servidor valida y evita sobreocupación.",
                    rol: "Cliente",
                  },
                ].map((s, i) => (
                  <li key={s.t} className="flex gap-4">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-title-sm font-bold text-primary">
                      {i + 1}
                    </span>
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-title-sm text-ink">{s.t}</p>
                        <Badge variant="neutral">{s.rol}</Badge>
                      </div>
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
                  Requiere rol <code className="font-mono">administrador</code> y
                  un token JWT válido.
                </p>
              </div>
            </div>
          </Card>
        </div>
        </div>
      )}
    </>
  );
}
