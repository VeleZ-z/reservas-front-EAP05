import { apiFetch, setToken, clearToken, getToken } from "./config";

export type Rol = "cliente" | "proveedor" | "administrador" | "CLIENTE" | "PROVEEDOR" | "ADMIN";

export interface Usuario {
  id?: string;
  nombre: string;
  email: string;
  telefono?: string;
  direccion?: string;
}

export interface LoginResponse {
  token: string;
  mensaje: string;
  usuario: string;
  rol: Rol;
}

export interface UsuarioRegistroResponse {
  id: string;
  nombre: string;
  email: string;
  mensaje?: string;
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
  if (data.token) setToken(data.token);
  return data;
}

/** POST /api/usuario/registrar */
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

/** POST /api/usuario/registrar/proveedor */
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

/** POST /api/auth/forgot-password */
export async function forgotPassword(email: string): Promise<{ mensaje: string }> {
  return apiFetch<{ mensaje: string }>("/api/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

/** POST /api/auth/reset-password */
export async function resetPassword(payload: {
  token: string;
  contrasena: string;
}): Promise<{ mensaje: string }> {
  return apiFetch<{ mensaje: string }>("/api/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
