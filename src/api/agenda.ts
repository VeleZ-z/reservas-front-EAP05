import { apiFetch, getToken } from "./config";

export interface AgendaItem {
  id: string;
  clienteId: string;
  servicioId: string;
  horarioId: string;
  estado: string;
  creadaEn: string;
}

/** GET /api/agenda — agenda del proveedor autenticado (rol PROVEEDOR) */
export async function consultarAgenda(): Promise<AgendaItem[]> {
  const data = await apiFetch<AgendaItem[] | { contenido?: AgendaItem[] }>(
    "/api/agenda",
    { method: "GET", token: getToken() }
  );
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && "contenido" in data && Array.isArray(data.contenido)) {
    return data.contenido;
  }
  return [];
}
