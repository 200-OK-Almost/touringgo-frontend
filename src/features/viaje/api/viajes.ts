import { http } from "../../../api/client";
import type { ResultadoPaginadoDto } from "../../../api/types";
import type { ItinerarioDto, ViajeCreateDto, ViajeDto, ViajeUpdateDto } from "../types";

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

export function getMisViajes() : Promise<ResultadoPaginadoDto<ViajeDto>> {
  return http.get(`${VIAJES_BASE}`)
}

export function actualizarViaje(id: string, dto: ViajeUpdateDto): Promise<ViajeDto> {
  return http.put(`${VIAJES_BASE}/${id}`, dto)
}

export function eliminarViaje(id: string): Promise<void> {
  return http.delete<void>(`${VIAJES_BASE}/${id}`)
}

export function eliminarParada(
  viajeId: string,
  numeroDia: number,
  paradaId: string,
  version: string
): Promise<ItinerarioDto[]> {
  const parametros = new URLSearchParams({
    numeroDia: String(numeroDia),
    version,
  })

  return http.delete<ItinerarioDto[]>(
    `${VIAJES_BASE}/${viajeId}/itinerario/paradas/${paradaId}?${parametros.toString()}`
  )
}

export function construirViajeUpdateDto(viaje: ViajeDto, titulo: string): ViajeUpdateDto {
  return {
    titulo,
    tipoViaje: viaje.tipoViaje,
    estado: viaje.estado,
    barrio: viaje.barrio,
    alcanceTemporal: viaje.alcanceTemporal,
    fechaInicio: viaje.fechaInicio,
    fechaFin: viaje.fechaFin,
    nivelPresupuesto: viaje.nivelPresupuesto,
    ritmoCaminata: viaje.ritmoCaminata,
    limiteCuadrasEntreParadas: viaje.limiteCuadrasEntreParadas,
    tipoPuntoPartida: viaje.tipoPuntoPartida,
    lugarPartidaId: viaje.lugarPartidaId,
    nombrePuntoPartida: viaje.nombrePuntoPartida,
    direccionPartida: viaje.direccionPartida,
    latitudPartida: viaje.latitudPartida,
    longitudPartida: viaje.longitudPartida,
    categoriaCodigos: viaje.categoriaCodigos,
    parametrosFamilia: viaje.parametrosFamilia,
  }
}
