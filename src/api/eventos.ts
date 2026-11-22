import { apiFetch, getToken } from "./config";

/** DTOs para EventoController */
export interface RegistrarEventoRequest {
  nombre: string;
  descripcion: string;
  inicio: string; // ISO-8601 format (LocalDateTime)
  fin: string;
  capacidad: number;
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

export interface CancelarReservaEventoResponse {
  id: string;
  eventoId: string;
  clienteId: string;
  estado: string;
}

/** Registrar nuevo evento (solo administradores) */
export async function registrarEvento(payload: RegistrarEventoRequest): Promise<RegistroEventoResponse> {
  return apiFetch<RegistroEventoResponse>("/api/eventos/registrar", {
    method: "POST",
    token: getToken(),
    body: JSON.stringify(payload),
  });
}

/** Definir capacidad máxima del evento (solo administradores) */
export async function definirCapacidadEvento(id: string, payload: DefinirCapacidadEventoRequest): Promise<RegistroEventoResponse> {
  return apiFetch<RegistroEventoResponse>(`/api/eventos/${id}/capacidad`, {
    method: "PATCH",
    token: getToken(),
    body: JSON.stringify(payload),
  });
}

/** Consultar ocupación de eventos en un periodo (solo administradores) */
export async function consultarOcupacionEvento(desde: string, hasta: string): Promise<OcupacionEventoResponse[]> {
  const params = new URLSearchParams({ desde, hasta }).toString();
  return apiFetch<OcupacionEventoResponse[]>(`/api/eventos/ocupacion?${params}`, {
    method: "GET",
    token: getToken(),
  });
}

/** Cancelar reserva de evento (solo clientes autenticados) */
export async function cancelarReservaEvento(idEvento: string, idReserva: string): Promise<CancelarReservaEventoResponse> {
  return apiFetch<CancelarReservaEventoResponse>(`/api/eventos/${idEvento}/reservas/${idReserva}/cancelar`, {
    method: "POST",
    token: getToken(),
  });
}