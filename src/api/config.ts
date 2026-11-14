// Configuración de la API
// En producción, esta URL vendrá de las variables de entorno de Vercel
// IMPORTANTE: Debe empezar con NEXT_PUBLIC_ para estar disponible en el navegador
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const headers = {
  "Content-Type": "application/json",
};

// Helper para obtener headers con auth token si existe
export function getAuthHeaders(token?: string) {
  const baseHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    baseHeaders.Authorization = `Bearer ${token}`;
  }

  return baseHeaders;
}