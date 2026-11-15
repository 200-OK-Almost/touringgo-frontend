import { http } from "../../../api/client";
import type { ViajeDto } from "../types";

const VIAJES_BASE = "/itinerarios/api/viajes";

export function getViaje(id: string): Promise<ViajeDto> {
  return http.get(`${VIAJES_BASE}/${id}`);
}