// ============================================================
// Sesión del usuario en el navegador
// ============================================================
// El backend devuelve el email y el rol en la respuesta del login.
// Los guardamos para poder adaptar la navegación (cada rol ve
// secciones distintas) sin volver a pedir el perfil en cada página.
// ============================================================

import { getToken, setToken, clearToken } from "./config";

export type Rol = "cliente" | "proveedor" | "administrador";

export interface Sesion {
  token: string;
  usuario: string;
  rol: Rol;
}

const KEY = "sesion";

/** Normaliza el rol que devuelve el backend (siempre en minúsculas). */
export function normalizarRol(valor: string | undefined | null): Rol {
  const v = (valor || "").toLowerCase();
  if (v === "proveedor") return "proveedor";
  if (v === "administrador" || v === "admin") return "administrador";
  return "cliente";
}

/** Lee la sesión guardada (solo navegador). */
export function getSesion(): Sesion | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Sesion;
    if (!parsed?.token) return null;
    return { ...parsed, rol: normalizarRol(parsed.rol) };
  } catch {
    return null;
  }
}

/** Guarda la sesión y el token. */
export function setSesion(sesion: Sesion): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(sesion));
  setToken(sesion.token);
  window.dispatchEvent(new Event("sesion:cambiada"));
}

/** Cierra la sesión. */
export function clearSesion(): void {
  clearToken();
}

/** Indica si hay sesión activa. */
export function isAutenticado(): boolean {
  return Boolean(getToken());
}
