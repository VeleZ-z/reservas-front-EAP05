import { apiFetch, getToken } from "./config";

/** Respuesta real de POST /api/reservas/reservar (CrearReservaResponse). */
export interface CrearReservaResponse {
  id: string;
  clienteId?: string;
  servicioId: string;
  servicioNombre?: string;
  horarioId: string;
  horarioInicio?: string;
  horarioFin?: string;
  recursoId?: string;
  recursoNombre?: string;
  estado?: string;
  creadaEn?: string;
  mensaje?: string;
}

/** POST /api/reservas/reservar — body: { servicioId, horarioId } */
export async function crearReserva(payload: {
  servicioId: string;
  horarioId: string;
}): Promise<CrearReservaResponse> {
  return apiFetch<CrearReservaResponse>("/api/reservas/reservar", {
    method: "POST",
    token: getToken(),
    body: JSON.stringify(payload),
  });
}

/** POST /api/reservas/{id}/cancelar */
export async function cancelarReserva(id: string): Promise<{ mensaje?: string }> {
  return apiFetch<{ mensaje?: string }>(`/api/reservas/${id}/cancelar`, {
    method: "POST",
    token: getToken(),
  });
}
