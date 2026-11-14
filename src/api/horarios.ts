import { apiFetch, getToken } from "./config";

export interface Horario {
  id: string;
  proveedorId: string;
  inicio: string;
  fin: string;
  estado?: string;
}

/**
 * POST /api/horarios — body: { inicio, fin }
 * El `proveedorId` lo toma el backend del token (se sobrescribe), por eso
 * no se envía. Las fechas son `LocalDateTime` en ISO-8601 sin zona:
 * `2026-11-20T09:00:00`.
 */
export async function registrarHorario(payload: {
  inicio: string;
  fin: string;
}): Promise<Horario> {
  return apiFetch<Horario>("/api/horarios", {
    method: "POST",
    token: getToken(),
    body: JSON.stringify(payload),
  });
}

/** PATCH /api/horarios/{id}/bloquear — sin body */
export async function bloquearHorario(id: string): Promise<Horario> {
  return apiFetch<Horario>(`/api/horarios/${id}/bloquear`, {
    method: "PATCH",
    token: getToken(),
  });
}
