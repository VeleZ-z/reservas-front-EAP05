import { API_BASE_URL, headers } from "./config";

export interface Reserva {
  id: string;
  servicioId: string;
  recursoId: string;
  usuarioId: string;
  fecha: string;
  hora: string;
  estado: "pendiente" | "confirmada" | "cancelada";
  createdAt: string;
}

export async function listarReservas(): Promise<Reserva[]> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No hay token de sesión");

  const response = await fetch(`${API_BASE_URL}/api/reservas`, {
    method: "GET",
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.mensaje || "Error al listar reservas");
  }

  return response.json();
}

export async function crearReserva(reserva: {
  servicioId: string;
  recursoId: string;
  fecha: string;
  hora: string;
  usuario: string;
}): Promise<Reserva> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No hay token de sesión");

  const response = await fetch(`${API_BASE_URL}/api/reservas`, {
    method: "POST",
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(reserva),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.mensaje || "Error al crear reserva");
  }

  return response.json();
}

export async function cancelarReserva(id: string): Promise<void> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No hay token de sesión");

  const response = await fetch(`${API_BASE_URL}/api/reservas/${id}`, {
    method: "DELETE",
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Error al cancelar reserva");
}