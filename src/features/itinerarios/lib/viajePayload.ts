import { barrioLabel } from "../../../lib/format";
import type { ViajeCreateDto, ViajeDiaCreateDto } from "../../viaje/types";
import type { DiaPlanificacion, ItineraryFormData } from "../planificacionFormData";

function construirDia(dia: DiaPlanificacion): ViajeDiaCreateDto {
  if (!dia.barrio || !dia.puntoInicio) {
    throw new Error(`El día ${dia.dia} está incompleto.`);
  }

  return {
    numeroDia: dia.dia,
    fecha: dia.fecha,
    barrio: dia.barrio,
    tipoPuntoPartida: dia.puntoInicio,
    lugarPartidaId: dia.hospedajeLugarGuid ?? undefined,
  };
}

export function construirViajeCreateDto(
  formData: ItineraryFormData
): ViajeCreateDto {
  const primerDia = formData.dias[0];

  if (!primerDia?.barrio || !primerDia.puntoInicio) {
    throw new Error("El viaje necesita al menos un día completo.");
  }

  return {
    titulo: `Salida por ${barrioLabel(primerDia.barrio)}`,
    tipoViaje: formData.modalidadViaje!,
    barrio: primerDia.barrio,
    alcanceTemporal: formData.disponibilidadDiaria!,
    fechaInicio: formData.fechaInicio!,
    fechaFin: formData.fechaFin!,
    nivelPresupuesto: formData.presupuestoNivel!,
    ritmoCaminata: formData.ritmoVisita!,
    tipoPuntoPartida: primerDia.puntoInicio,
    lugarPartidaId: primerDia.hospedajeLugarGuid ?? undefined,
    categoriaCodigos: formData.categoriasPrioritarias.map(
      (categoria) => categoria.codigo
    ),
    dias: formData.dias.map(construirDia),
  };
}
