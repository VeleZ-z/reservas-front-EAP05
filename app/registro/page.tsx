"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { registrarCliente } from "@/src/api/auth";

export default function RegistroPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    contrasena: "",
    telefono: "",
    direccion: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await registrarCliente(form);
      router.push("/login?registrado=1");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo completar el registro");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-lg flex-col justify-center py-12">
      <div className="mb-8 text-center">
        <h1 className="text-heading-md text-ink">Crea tu cuenta</h1>
        <p className="mt-2 text-body text-ink-muted">
          Regístrate como cliente para reservar servicios y consultar tu historial.
        </p>
      </div>

      <div className="surface-card p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
          {error ? <Alert variant="danger">{error}</Alert> : null}

          <div className="flex flex-col gap-2">
            <Label htmlFor="nombre" required>Nombre completo</Label>
            <Input id="nombre" value={form.nombre} onChange={set("nombre")} placeholder="María González" required />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email" required>Correo electrónico</Label>
            <Input id="email" type="email" autoComplete="email" value={form.email} onChange={set("email")} placeholder="tu@correo.com" required />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="telefono" required hint="Incluye código de país o área.">
              Teléfono
            </Label>
            <Input id="telefono" type="tel" autoComplete="tel" value={form.telefono} onChange={set("telefono")} placeholder="+57 300 000 0000" required />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="direccion" required>Dirección</Label>
            <Input id="direccion" autoComplete="street-address" value={form.direccion} onChange={set("direccion")} placeholder="Calle 1 #2-3, Ciudad" required />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="contrasena" required hint="Mínimo 6 caracteres.">
              Contraseña
            </Label>
            <Input id="contrasena" type="password" autoComplete="new-password" value={form.contrasena} onChange={set("contrasena")} placeholder="••••••••" minLength={6} required />
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Creando cuenta…" : "Crear cuenta"}
          </Button>
        </form>
      </div>

      <p className="mt-6 text-center text-body-sm text-ink-muted">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-semibold text-primary hover:text-primary-hover">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
