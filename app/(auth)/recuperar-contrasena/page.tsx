"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { forgotPassword } from "@/src/api/auth";

export default function RecuperarContrasenaPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMsg(null);
    setLoading(true);
    try {
      const res = await forgotPassword(email);
      setMsg(
        res?.mensaje ??
          "Si el correo existe, te enviaremos las instrucciones para restablecer tu contraseña."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo procesar la solicitud"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2 text-center lg:text-left">
        <h1 className="text-heading-md text-ink">Recupera tu acceso</h1>
        <p className="text-body text-ink-muted">
          Te enviaremos un enlace para restablecer tu contraseña.
        </p>
      </div>

      <div className="surface-card p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
          {error ? (
            <Alert variant="danger" title="No se pudo procesar la solicitud">
              {error}
            </Alert>
          ) : null}
          {msg ? (
            <Alert variant="success" title="Solicitud recibida">
              {msg}
            </Alert>
          ) : null}

          <div className="flex flex-col gap-2">
            <Label htmlFor="email" required>
              Correo electrónico
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              required
            />
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Enviando…" : "Enviar enlace"}
          </Button>
        </form>
      </div>

      <p className="text-center text-body-sm text-ink-muted">
        <Link href="/login" className="font-semibold text-primary hover:text-primary-hover">
          Volver a iniciar sesión
        </Link>
      </p>
    </div>
  );
}
