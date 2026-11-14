// Configuración de la API
// En producción, esta URL vendrá de las variables de entorno de Vercel
// Pero no usamos NEXT_PUBLIC_ para evitar exposición en el navegador
// En su lugar, definimos la URL directamente o la leemos de process.env sin el prefijo público
const isProduction = process.env.NODE_ENV === "production";

// En producción usamos la URL del despliegue, en desarrollo localhost
export const API_BASE_URL = isProduction 
  ? "https://tu-aplicacion.vercel.app" 
  : "http://localhost:8080";

export const headers = {
  "Content-Type": "application/json",
};

// Helper para obtener headers con auth token si existe (solo en cliente)
export function getAuthHeaders(token?: string) {
  const baseHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    baseHeaders.Authorization = `Bearer ${token}`;
  }

  return baseHeaders;
}