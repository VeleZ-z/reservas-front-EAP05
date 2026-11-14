import { apiFetch, getToken } from "./config";

export interface AsignacionProveedor {
  id?: string;
  servicioId: string;
  proveedorId: string;
  mensaje?: string;
}

/** POST /api/proveedor-servicio/asignar — body: { servicioId, proveedorId } */
export async function asignarProveedor(payload: {
  servicioId: string;
  proveedorId: string;
}): Promise<AsignacionProveedor> {
  return apiFetch<AsignacionProveedor>("/api/proveedor-servicio/asignar", {
    method: "POST",
    token: getToken(),
    body: JSON.stringify(payload),
  });
}
