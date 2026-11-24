import { http } from "../../../api/client";
import type { ResultadoPaginadoDto } from "../../../api/types";
import type { CrearGastoRequestDto, EstadoGastoFiltro, FiltroGastosDto, GastoDto, ItinerarioDto, LiquidacionDto, LiquidarGastosRequestDto, MiembroViajeDto, PrevisualizacionLiquidacionDto, ViajeCreateDto, ViajeDto, ViajeUpdateDto } from "../types";

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

export function unirseViaje(codigoInvitacion: string) {
  return http.post<ViajeDto>(`${VIAJES_BASE}/unirse`, {
    codigoInvitacion
  })
}

export function getMiembrosViaje(viajeId: string) {
  return http.get<MiembroViajeDto[]>(`${VIAJES_BASE}/${viajeId}/miembros`)
}

// gastos
export function postGasto(viajeId: string, crearGastoRequestDto: CrearGastoRequestDto) {
  return http.post(`${VIAJES_BASE}/${viajeId}/gastos`, crearGastoRequestDto)
}

function buildQuery(filtro: FiltroGastosDto): string {
  const params = new URLSearchParams();

  if (filtro.estado) params.set("estado", filtro.estado);
  if (filtro.usuarioId) params.set("usuarioId", filtro.usuarioId);
  if (filtro.moneda) params.set("moneda", filtro.moneda);
  if (filtro.fechaDesde) params.set("fechaDesde", filtro.fechaDesde);
  if (filtro.fechaHasta) params.set("fechaHasta", filtro.fechaHasta);

  params.set("pagina", String(filtro.pagina ?? 1));
  params.set("tamano", String(filtro.tamano ?? 100));

  const query = params.toString();
  return query ? `?${query}` : "";
}

export function getGastos(
  viajeId: string, filtro: FiltroGastosDto = {}): Promise<ResultadoPaginadoDto<GastoDto>> 
{
  return http.get(`${VIAJES_BASE}/${viajeId}/gastos${buildQuery(filtro)}`);
}

export function getLiquidacionPreview(
  viajeId: string, liquidarGastosRequestDto: LiquidarGastosRequestDto
) {
  return http.post<PrevisualizacionLiquidacionDto>(
    `${VIAJES_BASE}/${viajeId}/gastos/liquidaciones/previsualizacion`,
    liquidarGastosRequestDto
  );
}

export function postLiquidacion(
  viajeId: string, liquidarGastosRequestDto: LiquidarGastosRequestDto
) {
  return http.post<LiquidacionDto>(
    `${VIAJES_BASE}/${viajeId}/gastos/liquidaciones`,
    liquidarGastosRequestDto
  );
}