import { apiFetch, getToken, clearToken } from "./config";
import { setSesion, normalizarRol, type Rol } from "./sesion";

export type { Rol };

export interface Usuario {
  id?: string;
  nombre: string;
  email: string;
  telefono?: string;
  direccion?: string;
}

/** Respuesta real de POST /api/auth/login -> { token, mensaje, usuario, rol } */
export interface LoginResponse {
  token: string;
  mensaje: string;
  usuario: string;
  rol: string;
}

export interface UsuarioRegistroResponse {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  direccion?: string;
  rol?: string;
  mensaje?: string;
  createdAt?: string;
}

/** POST /api/auth/login -> { token, mensaje, usuario, rol } */
export async function login(credenciales: {
  email: string;
  contrasena: string;
}): Promise<LoginResponse> {
  const data = await apiFetch<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(credenciales),
  });
  if (data.token) {
    setSesion({
      token: data.token,
      usuario: data.usuario,
      rol: normalizarRol(data.rol),
    });
  }
  return data;
}

/** POST /api/usuario/registrar — body: { nombre, contrasena, email, telefono, direccion } */
export async function registrarCliente(payload: {
  nombre: string;
  contrasena: string;
  email: string;
  telefono: string;
  direccion: string;
}): Promise<UsuarioRegistroResponse> {
  return apiFetch<UsuarioRegistroResponse>("/api/usuario/registrar", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** POST /api/usuario/registrar/proveedor — mismo body que el cliente */
export async function registrarProveedor(payload: {
  nombre: string;
  contrasena: string;
  email: string;
  telefono: string;
  direccion: string;
}): Promise<UsuarioRegistroResponse> {
  return apiFetch<UsuarioRegistroResponse>("/api/usuario/registrar/proveedor", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** POST /api/auth/logout (requiere Authorization) */
export async function logout(): Promise<void> {
  try {
    await apiFetch("/api/auth/logout", {
      method: "POST",
      token: getToken(),
    });
  } finally {
    clearToken();
  }
}

/** POST /api/auth/forgot-password — body: { email } */
export async function forgotPassword(email: string): Promise<{ mensaje: string }> {
  return apiFetch<{ mensaje: string }>("/api/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

/**
 * POST /api/auth/reset-password
 * Contrato real verificado contra OpenAPI: { email, password, token }
 * (OJO: el backend usa `password`, no `contrasena`, en este endpoint).
 */
export async function resetPassword(payload: {
  email: string;
  password: string;
  token: string;
}): Promise<{ mensaje: string }> {
  return apiFetch<{ mensaje: string }>("/api/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
