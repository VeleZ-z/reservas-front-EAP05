import { apiFetch, getToken } from "./config";

export interface Recurso {
  id: string;
  nombre: string;
  descripcion?: string;
  activo?: boolean;
  createdAt?: string;
}

/** POST /api/recursos/registrar — body: { nombre, descripcion } (ambos obligatorios) */
export async function registrarRecurso(payload: {
  nombre: string;
  descripcion: string;
}): Promise<Recurso> {
  return apiFetch<Recurso>("/api/recursos/registrar", {
    method: "POST",
    token: getToken(),
    body: JSON.stringify(payload),
  });
}

/** PATCH /api/recursos/{id}/estado — body: { activo } */
export async function cambiarEstadoRecurso(
  id: string,
  activo: boolean
): Promise<Recurso> {
  return apiFetch<Recurso>(`/api/recursos/${id}/estado`, {
    method: "PATCH",
    token: getToken(),
    body: JSON.stringify({ activo }),
  });
}

/** POST /api/recursos/{id}/disponibilidad — body: { inicio, fin, rangoValido } */
export async function definirDisponibilidad(
  id: string,
  payload: { inicio: string; fin: string; rangoValido?: boolean }
): Promise<{ id: string; recursoId: string; inicio: string; fin: string }> {
  return apiFetch(`/api/recursos/${id}/disponibilidad`, {
    method: "POST",
    token: getToken(),
    body: JSON.stringify(payload),
  });
}
