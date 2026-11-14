// Configuración de la API
// En producción, esta URL vendrá de las variables de entorno de Vercel
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const headers = {
  "Content-Type": "application/json",
};

export { obtenerPerfil } from "./auth";