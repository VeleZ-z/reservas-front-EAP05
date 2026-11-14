import { API_BASE_URL, headers } from "./config";

interface Credenciales {
  email: string;
  password: string;
}

interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: string;
}

interface AuthResponse {
  user: Usuario;
  token: string;
}

export async function login(credenciales: Credenciales): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers,
    body: JSON.stringify(credenciales),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.mensaje || "Error en la autenticación");
  }

  return response.json();
}

export async function registrar(usuarioData: {
  nombre: string;
  email: string;
  password: string;
  rol: string;
}): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/registrar`, {
    method: "POST",
    headers,
    body: JSON.stringify(usuarioData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.mensaje || "Error en el registro");
  }

  return response.json();
}

export async function obtenerPerfil(): Promise<Usuario> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No hay token de sesión");

  const response = await fetch(`${API_BASE_URL}/api/auth/perfil`, {
    method: "GET",
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.mensaje || "Error al obtener perfil");
  }

  return response.json();
}

export function logout(): void {
  localStorage.removeItem("token");
}