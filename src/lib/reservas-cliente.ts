// ============================================================
// Historial local de reservas del cliente
// ============================================================
// El backend no expone un endpoint para listar las reservas de un
// cliente (solo `POST /api/reservas/reservar` y `.../cancelar`), por lo
// que el frontend guarda en localStorage las reservas que el usuario
// crea durante la sesión. Es el historial visible para el cliente.
//
// Clave por usuario: así dos cuentas en el mismo navegador no mezclan
// sus reservas.
// ============================================================

export interface ReservaLocal {
  id: string;
  servicioId: string;
  servicioNombre?: string;
  horarioId: string;
  horarioInicio?: string;
  horarioFin?: string;
  recursoNombre?: string;
  estado: string;
  creadaEn: string;
}

const prefijo = (email: string) => `reservas:${email.toLowerCase()}`;

/** Valida un UUID v4 (formato que exige el backend). */
export function esUuid(valor: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    valor.trim()
  );
}

/** Lee el historial guardado de un usuario. */
export function listarReservas(email: string): ReservaLocal[] {
  if (typeof window === "undefined" || !email) return [];
  try {
    const raw = window.localStorage.getItem(prefijo(email));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ReservaLocal[]) : [];
  } catch {
    return [];
  }
}

/** Guarda (o actualiza) una reserva en el historial local. */
export function guardarReserva(email: string, reserva: ReservaLocal): void {
  if (typeof window === "undefined" || !email) return;
  const actuales = listarReservas(email).filter((r) => r.id !== reserva.id);
  actuales.unshift(reserva);
  window.localStorage.setItem(prefijo(email), JSON.stringify(actuales));
}

/** Cambia el estado de una reserva (por ejemplo, a CANCELADA). */
export function actualizarEstado(
  email: string,
  id: string,
  estado: string
): void {
  if (typeof window === "undefined" || !email) return;
  const actuales = listarReservas(email).map((r) =>
    r.id === id ? { ...r, estado } : r
  );
  window.localStorage.setItem(prefijo(email), JSON.stringify(actuales));
}
