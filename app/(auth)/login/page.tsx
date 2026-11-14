"use client";

import { useEffect, useState } from "react";
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
  const [registrado, setRegistrado] = useState(false);

  // Mensaje de confirmación tras el registro (query param ?registrado=1).
  useEffect(() => {
    setRegistrado(window.location.search.includes("registrado=1"));
  }, []);

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
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2 text-center lg:text-left">
        <h1 className="text-heading-md text-ink">Bienvenido de vuelta</h1>
        <p className="text-body text-ink-muted">
          Inicia sesión para gestionar tus reservas y tu agenda.
        </p>
      </div>

      <div className="surface-card p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
          {error ? (
            <Alert variant="danger" title="No pudimos iniciar sesión">
              {error}
            </Alert>
          ) : null}
          {registrado && !error ? (
            <Alert variant="success" title="Cuenta creada">
              Ya puedes iniciar sesión con tus credenciales.
            </Alert>
          ) : null}

          <div className="flex flex-col gap-2">
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
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-3">
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
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Verificando…" : "Iniciar sesión"}
          </Button>
        </form>
      </div>

      <p className="text-center text-body-sm text-ink-muted">
        ¿Aún no tienes cuenta?{" "}
        <Link href="/registro" className="font-semibold text-primary hover:text-primary-hover">
          Regístrate como cliente
        </Link>
      </p>
    </div>
  );
}
