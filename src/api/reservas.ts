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

/** GET /api/reservas/historial (HistorialReservaResponse) */
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

/** GET /api/reservas/historial-proveedor (HistorialProveedorResponse) */
export interface HistorialProveedorResponse {
  reservaId: string;
  servicioId: string;
  nombreServicio?: string;
  clienteId: string;
  nombreCliente?: string;
  horarioId: string;
  inicio: string;
  fin: string;
  recursoId?: string;
  nombreRecurso?: string;
  estado: string;
  creadaEn: string;
}

/** GET /api/reservas/historial-negocio (HistorialNegocioResponse) */
export interface HistorialNegocioResponse {
  reservaId: string;
  tipo: string; // "SERVICIO" | "EVENTO"
  itemId: string;
  nombreItem?: string;
  clienteId: string;
  nombreCliente?: string;
  inicio: string;
  fin: string;
  recursoId?: string;
  nombreRecurso?: string;
  estado: string;
  creadaEn?: string;
}

/** GET /api/reservas/ocupacion-servicios (OcupacionServicioResponse) */
export interface OcupacionServicioResponse {
  servicioId: string;
  nombreServicio: string;
  totalHorarios: number;
  horariosReservados: number;
  porcentajeOcupacion: number;
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

/**
 * GET /api/reservas/historial — historial del cliente autenticado.
 * El backend devuelve `{ reservas, mensaje }` cuando está vacío.
 */
export async function consultarHistorial(): Promise<HistorialReservaResponse[]> {
  const data = await apiFetch<
    HistorialReservaResponse[] | { reservas?: HistorialReservaResponse[] }
  >("/api/reservas/historial", { method: "GET", token: getToken() });
  return Array.isArray(data) ? data : data?.reservas ?? [];
}

/** GET /api/reservas/historial-proveedor — reservas de los servicios del proveedor. */
export async function consultarHistorialProveedor(): Promise<HistorialProveedorResponse[]> {
  const data = await apiFetch<
    HistorialProveedorResponse[] | { reservas?: HistorialProveedorResponse[] }
  >("/api/reservas/historial-proveedor", { method: "GET", token: getToken() });
  return Array.isArray(data) ? data : data?.reservas ?? [];
}

/** GET /api/reservas/historial-negocio — todas las reservas (servicios + eventos). */
export async function consultarHistorialNegocio(): Promise<HistorialNegocioResponse[]> {
  const data = await apiFetch<
    HistorialNegocioResponse[] | { reservas?: HistorialNegocioResponse[] }
  >("/api/reservas/historial-negocio", { method: "GET", token: getToken() });
  return Array.isArray(data) ? data : data?.reservas ?? [];
}

/** GET /api/reservas/ocupacion-servicios?desde=…&hasta=… (administradores). */
export async function consultarOcupacionServicios(
  desde: string,
  hasta: string
): Promise<OcupacionServicioResponse[]> {
  const params = new URLSearchParams({ desde, hasta }).toString();
  const data = await apiFetch<
    OcupacionServicioResponse[] | { servicios?: OcupacionServicioResponse[] }
  >(`/api/reservas/ocupacion-servicios?${params}`, {
    method: "GET",
    token: getToken(),
  });
  return Array.isArray(data) ? data : data?.servicios ?? [];
}
