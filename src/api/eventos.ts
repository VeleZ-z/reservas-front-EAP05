import { apiFetch, getToken } from "./config";

/** DTOs para EventoController */
export interface RegistrarEventoRequest {
  nombre: string;
  descripcion: string;
  inicio: string; // OffsetDateTime ISO-8601, p.ej. 2026-12-01T10:00:00-05:00
  fin: string;
  capacidad: number;
}

/** PUT /api/eventos/{id} (ModificarEventoRequest) */
export interface ModificarEventoRequest {
  nombre: string;
  descripcion?: string;
  inicio: string;
  fin: string;
}

export interface RegistroEventoResponse {
  id: string;
  nombre: string;
  descripcion: string;
  inicio: string;
  fin: string;
  capacidad: number;
  activo: boolean;
  createdAt: string;
}

export interface DefinirCapacidadEventoRequest {
  capacidad: number;
}

export interface OcupacionEventoResponse {
  eventoId: string;
  nombre: string;
  capacidad: number;
  reservados: number;
  porcentajeOcupacion: number;
}

/** POST /api/eventos/{id}/reservas (ReservaEventoResponse) */
export interface ReservaEventoResponse {
  id: string;
  eventoId: string;
  clienteId: string;
  estado: string;
  cuposRestantes: number;
}

export interface CancelarReservaEventoResponse {
  id: string;
  eventoId: string;
  clienteId: string;
  estado: string;
}

/** Normaliza respuestas que pueden venir como lista o como `{ mensaje, ... }`. */
function comoLista<T>(data: T[] | { [k: string]: unknown }): T[] {
  return Array.isArray(data) ? data : [];
}

/** Registrar nuevo evento (solo administradores) */
export async function registrarEvento(
  payload: RegistrarEventoRequest
): Promise<RegistroEventoResponse> {
  return apiFetch<RegistroEventoResponse>("/api/eventos/registrar", {
    method: "POST",
    token: getToken(),
    body: JSON.stringify(payload),
  });
}

/** Actualizar datos generales del evento (solo administradores) */
export async function actualizarEvento(
  id: string,
  payload: ModificarEventoRequest
): Promise<RegistroEventoResponse> {
  return apiFetch<RegistroEventoResponse>(`/api/eventos/${id}`, {
    method: "PUT",
    token: getToken(),
    body: JSON.stringify(payload),
  });
}

/** Definir capacidad máxima del evento (solo administradores) */
export async function definirCapacidadEvento(
  id: string,
  payload: DefinirCapacidadEventoRequest
): Promise<RegistroEventoResponse> {
  return apiFetch<RegistroEventoResponse>(`/api/eventos/${id}/capacidad`, {
    method: "PATCH",
    token: getToken(),
    body: JSON.stringify(payload),
  });
}

/** Consultar ocupación de eventos en un periodo (solo administradores) */
export async function consultarOcupacionEvento(
  desde: string,
  hasta: string
): Promise<OcupacionEventoResponse[]> {
  const params = new URLSearchParams({ desde, hasta }).toString();
  const data = await apiFetch<OcupacionEventoResponse[] | { mensaje?: string }>(
    `/api/eventos/ocupacion?${params}`,
    { method: "GET", token: getToken() }
  );
  return comoLista<OcupacionEventoResponse>(data);
}

/** Reservar un cupo del evento para el cliente autenticado (sin body). */
export async function reservarCupoEvento(id: string): Promise<ReservaEventoResponse> {
  return apiFetch<ReservaEventoResponse>(`/api/eventos/${id}/reservas`, {
    method: "POST",
    token: getToken(),
  });
}

/** Cancelar reserva de evento (solo clientes autenticados, ≥12 h antes). */
export async function cancelarReservaEvento(
  idEvento: string,
  idReserva: string
): Promise<CancelarReservaEventoResponse> {
  return apiFetch<CancelarReservaEventoResponse>(
    `/api/eventos/${idEvento}/reservas/${idReserva}/cancelar`,
    { method: "POST", token: getToken() }
  );
}
