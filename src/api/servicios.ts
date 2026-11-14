import { API_BASE_URL, headers } from "./config";

export async function listarServicios(): Promise<any[]> {
  const response = await fetch(`${API_BASE_URL}/api/servicios`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.mensaje || "Error al listar servicios");
  }

  return response.json();
}

export async function crearServicio(servicio: {
  nombre: string;
  descripcion: string;
  duracion: number;
  precio: number;
}): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/servicios`, {
    method: "POST",
    headers,
    body: JSON.stringify(servicio),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.mensaje || "Error al crear servicio");
  }

  return response.json();
}

export async function actualizarServicio(id: string, servicio: Partial<any>): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/servicios/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(servicio),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.mensaje || "Error al actualizar servicio");
  }

  return response.json();
}

export async function eliminarServicio(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/servicios/${id}`, {
    method: "DELETE",
    headers,
  });

  if (!response.ok) throw new Error("Error al eliminar servicio");
}