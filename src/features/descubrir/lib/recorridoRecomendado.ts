import { toDateOnlyString } from "../../../lib/format";
import type { ViajeRecomendadoCreateDto } from "../../viaje/types";
import type { ItinerarioDestacado } from "../types";
import { ordenarPorCercania } from "./ordenarParadas";

const TITULO_MAXIMO = 100;

export function construirViajeRecomendadoDto(
  itinerario: ItinerarioDestacado,
  fecha: Date = new Date()
): ViajeRecomendadoCreateDto {
  const lugares = ordenarPorCercania(itinerario.lugares);
  const fechaLocal = toDateOnlyString(fecha);

  return {
    titulo: `Recorrido: ${itinerario.tema.titulo}`.slice(0, TITULO_MAXIMO),
    barrio: itinerario.tema.barrio,
    categoriaCodigo: itinerario.tema.categoriaCodigo ?? null,
    lugarIds: lugares.map((lugar) => lugar.id),
    fechaInicio: fechaLocal,
    fechaFin: fechaLocal,
  };
}
