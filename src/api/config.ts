// ============================================================
// Configuración y transporte de la API
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

/**
 * Timeout por defecto. El backend vive en el plan gratuito de Render,
 * donde el "cold start" puede tardar ~80 s; cortamos a 120 s para no
 * dejar la interfaz colgada indefinidamente.
 */
export const DEFAULT_TIMEOUT_MS = 120_000;

/** Error de API con el status HTTP y el cuerpo original. */
export interface ApiError extends Error {
  status?: number;
  body?: unknown;
}

/** Extrae el mensaje de error del backend, que usa 3 formatos distintos. */
function extractMessage(body: unknown, status: number): string {
  if (typeof body === "string" && body.trim()) return body.trim();
  if (body && typeof body === "object") {
    const b = body as Record<string, unknown>;
    for (const key of ["mensaje", "error", "message", "detail"]) {
      const value = b[key];
      if (typeof value === "string" && value.trim()) return value.trim();
    }
  }
  if (status === 401) return "Tu sesión expiró. Inicia sesión nuevamente.";
  if (status === 403) return "No tienes permisos para realizar esta acción.";
  if (status === 404) return "El recurso solicitado no existe.";
  return `Error ${status} al comunicar con el servidor.`;
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
  window.localStorage.removeItem("sesion");
  window.dispatchEvent(new Event("sesion:cambiada"));
}

/**
 * Wrapper de fetch con manejo centralizado de errores y timeout.
 *
 * - Lanza un `Error` con el mensaje real del backend (`mensaje` | `error`).
 * - Convierte un 401 en cierre de sesión para que la UI reaccione.
 * - Traduce fallos de red y abortos a mensajes accionables.
 */
export async function apiFetch<T>(
  path: string,
  options: RequestInit & { token?: string | null; timeoutMs?: number } = {}
): Promise<T> {
  const { token, headers, timeoutMs = DEFAULT_TIMEOUT_MS, ...rest } = options;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      signal: controller.signal,
      headers: {
        ...DEFAULT_HEADERS,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(headers as Record<string, string>),
      },
    });
  } catch (err) {
    clearTimeout(timer);
    const aborted = err instanceof DOMException && err.name === "AbortError";
    const message = aborted
      ? "El servidor tardó demasiado en responder. Es posible que esté arrancando en frío; inténtalo de nuevo en un momento."
      : "No se pudo conectar con el servidor de reservas. Verifica tu conexión e inténtalo de nuevo.";
    const error = new Error(message) as ApiError;
    error.status = 0;
    throw error;
  }
  clearTimeout(timer);

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
    if (response.status === 401) clearToken();
    const error = new Error(extractMessage(body, response.status)) as ApiError;
    error.status = response.status;
    error.body = body;
    throw error;
  }

  return body as T;
}
