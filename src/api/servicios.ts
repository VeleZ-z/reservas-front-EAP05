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

/** Respuesta de GET /api/servicios/uso (UsoServicioResponse). */
export interface UsoServicioResponse {
  servicioId: string;
  nombre: string;
  reservas: number;
}

/**
 * GET /api/servicios/uso?desde=…&hasta=…
 * Cantidad de reservas por servicio en el periodo [desde, hasta). Solo administradores.
 * El backend puede devolver `{ mensaje }` si no hay datos; lo normalizamos a arreglo vacío.
 */
export async function consultarUsoServicios(
  desde: string,
  hasta: string
): Promise<UsoServicioResponse[]> {
  const params = new URLSearchParams({ desde, hasta }).toString();
  const data = await apiFetch<UsoServicioResponse[] | { mensaje?: string }>(
    `/api/servicios/uso?${params}`,
    { method: "GET", token: getToken() }
  );
  return Array.isArray(data) ? data : [];
}
