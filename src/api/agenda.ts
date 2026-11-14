import { apiFetch, getToken } from "./config";

export interface AgendaItem {
  id: string;
  clienteId: string;
  servicioId: string;
  horarioId: string;
  estado: string;
  creadaEn: string;
}

/**
 * GET /api/agenda — agenda del proveedor autenticado (rol PROVEEDOR).
 * El backend devuelve un array; si está vacío devuelve
 * `{ nota: "No existe endpoint de reservas programadas en la version actual de la rama de calidad." }`.
 */
export async function consultarAgenda(): Promise<AgendaItem[]> {
  const data = await apiFetch<AgendaItem[] | { mensaje?: string }>("/api/agenda", {
    method: "GET",
    token: getToken(),
  });
  if (Array.isArray(data)) return data;
  return [];
}
