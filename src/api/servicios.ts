import { apiFetch, getToken } from "./config";

export interface Servicio {
  id: string;
  nombre: string;
  descripcion?: string;
  duracionMin?: number;
  recursoId?: string;
  activo?: boolean;
  createdAt?: string;
}

/** POST /api/servicios/registrar — body: { nombre, descripcion?, duracionMin?, recursoId? } */
export async function registrarServicio(payload: {
  nombre: string;
  descripcion?: string;
  duracionMin?: number;
  recursoId?: string;
}): Promise<Servicio> {
  return apiFetch<Servicio>("/api/servicios/registrar", {
    method: "POST",
    token: getToken(),
    body: JSON.stringify(payload),
  });
}

/** PUT /api/servicios/{servicioId} — actualización parcial */
export async function modificarServicio(
  servicioId: string,
  payload: {
    nombre?: string;
    descripcion?: string;
    duracionMin?: number;
    recursoId?: string;
  }
): Promise<Servicio> {
  return apiFetch<Servicio>(`/api/servicios/${servicioId}`, {
    method: "PUT",
    token: getToken(),
    body: JSON.stringify(payload),
  });
}

/**
 * POST /api/servicios/validar-recurso
 * Contrato real verificado contra OpenAPI: body: { recursoId }.
 * El backend responde 200 con un texto plano ("El recurso es válido...").
 */
export async function validarRecurso(payload: {
  recursoId?: string;
}): Promise<string> {
  return apiFetch<string>("/api/servicios/validar-recurso", {
    method: "POST",
    token: getToken(),
    body: JSON.stringify(payload),
  });
}
