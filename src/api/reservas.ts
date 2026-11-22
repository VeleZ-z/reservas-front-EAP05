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

/** Respuesta de GET /api/reservas/historial (HistorialReservaResponse). */
export interface HistorialReservaResponse {
  reservaId: string;
  servicioId: string;
  nombreServicio?: string;
  horarioId: string;
  inicio: string;
  fin: string;
  recursoId?: string;
  nombreRecurso?: string;
  estado: string;
  creadaEn: string;
}

/**
 * GET /api/reservas/historial
 * Historial de reservas del cliente autenticado. Solo rol cliente.
 * El backend puede devolver `{ reservas, mensaje }`; normalizamos a arreglo.
 */
export async function consultarHistorial(): Promise<HistorialReservaResponse[]> {
  const data = await apiFetch<
    HistorialReservaResponse[] | { reservas?: HistorialReservaResponse[]; mensaje?: string }
  >("/api/reservas/historial", { method: "GET", token: getToken() });
  if (Array.isArray(data)) return data;
  return data?.reservas ?? [];
}
