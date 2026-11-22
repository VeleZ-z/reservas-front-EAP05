// ============================================================
// Utilidades de fecha para los formularios
// ============================================================
// Los <input type="datetime-local"> devuelven `YYYY-MM-DDTHH:mm`.
// El backend espera:
//   - OffsetDateTime (eventos, recursos): ISO-8601 con zona/offset.
//   - LocalDateTime  (reportes, horarios): ISO-8601 sin zona, con segundos.
// ============================================================

/** Convierte `datetime-local` a OffsetDateTime ISO en UTC (…Z). */
export function aOffsetDateTime(valor: string): string {
  if (!valor) return valor;
  const d = new Date(valor);
  if (Number.isNaN(d.getTime())) return valor;
  return d.toISOString();
}

/** Convierte `datetime-local` a LocalDateTime ISO sin zona (con segundos). */
export function aLocalDateTime(valor: string): string {
  if (!valor) return valor;
  // `YYYY-MM-DDTHH:mm` → añade segundos si faltan.
  return valor.length === 16 ? `${valor}:00` : valor;
}

/** Formatea una fecha ISO para mostrarla en español (fecha + hora). */
export function formatearFechaHora(valor?: string): string {
  if (!valor) return "—";
  const d = new Date(valor);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" });
}

/** Formatea solo la hora de una fecha ISO. */
export function formatearHora(valor?: string): string {
  if (!valor) return "—";
  const d = new Date(valor);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleTimeString("es-CO", { timeStyle: "short" });
}

/** Valor para un <input type="datetime-local"> a partir de un Date (hora local). */
export function valorInputDatetime(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Rango por defecto para reportes: desde hoy 00:00 hasta dentro de `dias` días 23:59. */
export function rangoReportePorDefecto(dias = 30): { desde: string; hasta: string } {
  const hoy = new Date();
  const inicio = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 0, 0);
  const fin = new Date(inicio);
  fin.setDate(fin.getDate() + dias);
  fin.setHours(23, 59);
  return { desde: valorInputDatetime(inicio), hasta: valorInputDatetime(fin) };
}
