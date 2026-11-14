"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { login } from "@/src/api/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login({ email, contrasena });
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar sesión");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md flex-col justify-center py-12">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-md">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-6">
            <path d="M8 2v4M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="m9 14 2 2 4-4" />
          </svg>
        </div>
        <h1 className="text-heading-md text-ink">Bienvenido de vuelta</h1>
        <p className="mt-2 text-body text-ink-muted">
          Inicia sesión para gestionar tus reservas y tu agenda.
        </p>
      </div>

      <div className="surface-card p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
          {error ? <Alert variant="danger">{error}</Alert> : null}

          <Label htmlFor="email" required>
            Correo electrónico
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="tu@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="flex items-center justify-between">
            <Label htmlFor="contrasena" required>
              Contraseña
            </Label>
            <Link
              href="/recuperar-contrasena"
              className="text-caption font-semibold text-primary hover:text-primary-hover"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <Input
            id="contrasena"
            name="contrasena"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Verificando…" : "Iniciar sesión"}
          </Button>
        </form>
      </div>

      <p className="mt-6 text-center text-body-sm text-ink-muted">
        ¿Aún no tienes cuenta?{" "}
        <Link href="/registro" className="font-semibold text-primary hover:text-primary-hover">
          Regístrate como cliente
        </Link>
      </p>
    </div>
  );
}
