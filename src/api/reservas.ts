import { apiFetch, getToken } from "./config";

export interface CrearReservaResponse {
  id: string;
  estado?: string;
  mensaje?: string;
  reservaId?: string;
  horarioId?: string;
  servicioId?: string;
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
