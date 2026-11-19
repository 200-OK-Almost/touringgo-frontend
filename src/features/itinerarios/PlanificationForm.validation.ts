import type { ItineraryFormData } from "./planificacionFormData";
import { barrioLabel } from "../../lib/format";
import {
  duracionDiasInclusiva,
  MAX_DIAS_VIAJE,
  MENSAJE_RANGO_INVALIDO,
} from "./lib/fechas";
import {
  diaEstaCompleto,
  diasConPreferenciasFaltantes,
} from "./lib/diasPlanificacion";

export type FormErrors = Partial<
  Record<keyof ItineraryFormData, string>
> & {
  barrio?: string;
  puntoInicio?: string;
  hospedajeLugarGuid?: string;
};

export function validateStep(formData: ItineraryFormData, step: number): FormErrors {
  const errors: FormErrors = {};

  switch (step) {
    case 0: 
      if (!formData.fechaInicio) {
        errors.fechaInicio = "Seleccioná la fecha de inicio.";
      } else if (!formData.fechaFin) {
        errors.fechaFin = "Seleccioná la fecha de fin.";
      } else {
        const dias = duracionDiasInclusiva(formData.fechaInicio, formData.fechaFin);

        if (dias === null || dias < 1) {
          errors.fechaFin = "La fecha de fin no puede ser anterior a la fecha de inicio.";
        } else if (dias > MAX_DIAS_VIAJE) {
          errors.fechaFin = MENSAJE_RANGO_INVALIDO;
        }
      }

      if (formData.disponibilidadDiaria == null) {
        errors.disponibilidadDiaria = "Seleccioná una opción de disponiblidad";
      }
      break;

    case 1: {
      if (formData.dias.length === 0) {
        errors.dias = "Elegí las fechas del viaje para definir los días.";
        break;
      }

      if (formData.dias.length === 1) {
        const dia = formData.dias[0];
        const barrio = dia.barrio;
        const puntoInicio = dia.puntoInicio;
        const hospedajeLugarGuid = dia.hospedajeLugarGuid;
        const hospedajeBarrio = dia.hospedajeBarrio;

        if (barrio == null)
          errors.barrio = "Seleccioná un barrio.";

        if (puntoInicio == null) {
          errors.puntoInicio = "Seleccioná un punto de partida.";
        } else if (
          (puntoInicio === "HospedajePropio" || puntoInicio === "HospedajeSugerido") &&
          hospedajeLugarGuid == null
        ) {
          errors.hospedajeLugarGuid = "Seleccioná un lugar de alojamiento de la lista.";
        } else if (
          (puntoInicio === "HospedajeSugerido" || puntoInicio === "HospedajePropio") &&
          hospedajeLugarGuid != null &&
          barrio != null &&
          hospedajeBarrio != null &&
          hospedajeBarrio !== barrio
        ) {
          errors.hospedajeLugarGuid = `El alojamiento recomendado debe pertenecer al barrio seleccionado (${barrioLabel(barrio)}).`;
        }

        break;
      }

      const diasFaltantes = formData.dias
        .filter((dia) => !diaEstaCompleto(dia))
        .map((dia) => `Día ${dia.dia}`);

      if (diasFaltantes.length > 0) {
        errors.dias = `Faltan completar: ${diasFaltantes.join(", ")}.`;
      }

      break;
    }

    case 2: {
      if (formData.dias.length === 0) {
        errors.dias = "Elegí las fechas del viaje para definir los días.";
        break;
      }

      if (formData.dias.length === 1) {
        const dia = formData.dias[0];

        if (dia.modalidadViaje == null) {
          errors.modalidadViaje = "Seleccioná una modalidad de viaje.";
        }

        if (
          dia.categoriasPrioritarias.length < 2 ||
          dia.categoriasPrioritarias.length > 4
        ) {
          errors.categoriasPrioritarias = "Seleccioná entre 2 y 4 categorías.";
        }

        break;
      }

      const diasFaltantes = diasConPreferenciasFaltantes(formData.dias);

      if (diasFaltantes.length > 0) {
        errors.dias = `Faltan completar: ${diasFaltantes.join(", ")}.`;
      }

      break;
    }
    
    case 3:
      if (formData.ritmoVisita == null) {
        errors.ritmoVisita = "Seleccioná el ritmo de la salida.";
      }
      // if (formData.tipoTransporte == null) {
      //   errors.tipoTransporte = "Seleccioná un medio de transporte.";
      // }
      if (formData.presupuestoNivel == null) {
        errors.presupuestoNivel = "Seleccioná un nivel de presupuesto.";
      }
  }

  return errors;
}