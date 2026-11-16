import { http } from "../../../api/client";
import type { ResultadoPaginadoDto } from "../../../api/types";
import type { ItinerarioDto, ViajeCreateDto, ViajeDto } from "../types";

const VIAJES_BASE = "/itinerarios/api/viajes";

export function getViaje(id: string): Promise<ViajeDto> {
  return http.get(`${VIAJES_BASE}/${id}`);
}

export function createViaje(viajeCreateDto: ViajeCreateDto) : Promise<ViajeDto>{
  return http.post(`${VIAJES_BASE}`, viajeCreateDto)
}

export function generateViaje(id: string) : Promise<ItinerarioDto[]> {
  return http.post(`${VIAJES_BASE}/${id}/itinerario`)
}

// export function getMisViajes() : Promise<ViajeDto[]> {
//   return http.get(`${VIAJES_BASE}/${id}/itinerario`)
// }

export function getAllViajes() : Promise<ResultadoPaginadoDto<ViajeDto>> {
  return http.get(`${VIAJES_BASE}`)
}