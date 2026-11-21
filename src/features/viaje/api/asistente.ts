import { http } from "../../../api/client";
import type {
  AplicarAccionAsistenteDto,
  AsistenteCapacidadesDto,
  AsistenteRequestDto,
  AsistenteResponseDto,
  ItinerarioDto,
} from "../types";

const ASISTENTE_BASE = "/itinerarios/api/viajes";

export function enviarMensajeAsistente(
  viajeId: string,
  payload: AsistenteRequestDto
): Promise<AsistenteResponseDto> {
  return http.post<AsistenteResponseDto>(
    `${ASISTENTE_BASE}/${viajeId}/asistente`,
    payload
  );
}

export function aplicarAccionAsistente(
  viajeId: string,
  accion: AplicarAccionAsistenteDto
): Promise<ItinerarioDto[]> {
  return http.post<ItinerarioDto[]>(
    `${ASISTENTE_BASE}/${viajeId}/asistente/aplicar`,
    accion
  );
}

export function getCapacidadesAsistente(): Promise<AsistenteCapacidadesDto> {
  return http.get<AsistenteCapacidadesDto>(
    `${ASISTENTE_BASE}/asistente/capacidades`
  );
}
