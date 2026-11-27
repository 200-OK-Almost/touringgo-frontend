import { ApiError } from "../../../api/client";

export function crearMensajeErrorEnvio(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 0) {
      return "No pudimos conectar con el servidor. Revisá tu conexión e intentá de nuevo.";
    }

    if (error.status === 401 || error.status === 403) {
      return "No tenés permisos para crear este viaje. Iniciá sesión nuevamente e intentá de nuevo.";
    }

    if (error.status === 429) {
      return error.retryAfterSeconds
        ? `Demasiadas solicitudes. Podés reintentar en ${error.retryAfterSeconds} segundos.`
        : "Demasiadas solicitudes. Esperá unos segundos e intentá de nuevo.";
    }

    if (error.status >= 500) {
      return "El servidor no pudo crear el viaje. Intentá de nuevo en unos minutos.";
    }

    return error.message || "No se pudo crear el viaje.";
  }

  return "No se pudo crear el viaje. Intentá de nuevo en unos segundos.";
}
