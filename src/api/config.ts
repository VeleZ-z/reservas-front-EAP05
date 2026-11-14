// ============================================================
// Configuración de la API
// ============================================================
// La variable NEXT_PUBLIC_API_URL está configurada en Vercel como
// "Environment Variable" (pública), NO como Secret, porque el frontend
// necesita conocer la URL del backend desde el navegador.
//
// Vercel -> Settings -> Environment Variables -> NEXT_PUBLIC_API_URL
//   Valor: https://fabrica-2026-2-eap05-1.onrender.com
//
// Next.js inyecta process.env.NEXT_PUBLIC_* en tiempo de build,
// por eso la variable debe existir ANTES de desplegar.
// ============================================================

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
).replace(/\/$/, "");

export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

/** Construye los headers incluyendo el token JWT si existe. */
export function authHeaders(token?: string | null): Record<string, string> {
  const h: Record<string, string> = { ...DEFAULT_HEADERS };
  const jwt = token ?? getToken();
  if (jwt) {
    h.Authorization = `Bearer ${jwt}`;
  }
  return h;
}

/** Lee el token desde localStorage (solo navegador). */
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("token");
}

/** Guarda el token (solo navegador). */
export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("token", token);
}

/** Elimina el token (solo navegador). */
export function clearToken(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("token");
}

/**
 * Wrapper de fetch con manejo centralizado de errores.
 * Lanza un Error con el mensaje que devuelve el backend (`mensaje`).
 */
export async function apiFetch<T>(
  path: string,
  options: RequestInit & { token?: string | null } = {}
): Promise<T> {
  const { token, headers, ...rest } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      ...DEFAULT_HEADERS,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers as Record<string, string>),
    },
  });

  const raw = await response.text();
  let body: unknown = null;
  if (raw) {
    try {
      body = JSON.parse(raw);
    } catch {
      body = raw;
    }
  }

  if (!response.ok) {
    const mensaje =
      (body && typeof body === "object" && "mensaje" in body
        ? String((body as { mensaje: unknown }).mensaje)
        : null) ?? `Error ${response.status}`;
    const error = new Error(mensaje) as Error & { status?: number; body?: unknown };
    error.status = response.status;
    error.body = body;
    throw error;
  }

  return body as T;
}
