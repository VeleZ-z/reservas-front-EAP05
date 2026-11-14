import { apiFetch, getToken } from "./config";

export interface Servicio {
  id: string;
  nombre: string;
  descripcion?: string;
  duracionMin?: number;
  recursoId?: string;
  recursoNombre?: string;
  activo?: boolean;
  createdAt?: string;
}

/** POST /api/servicios/registrar */
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

/** PUT /api/servicios/{servicioId} */
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

/** POST /api/servicios/validar-recurso */
export async function validarRecurso(payload: {
  nombre: string;
  recursoId?: string;
}): Promise<{ valido: boolean; mensaje?: string }> {
  return apiFetch<{ valido: boolean; mensaje?: string }>(
    "/api/servicios/validar-recurso",
    {
      method: "POST",
      token: getToken(),
      body: JSON.stringify(payload),
    }
  );
}
