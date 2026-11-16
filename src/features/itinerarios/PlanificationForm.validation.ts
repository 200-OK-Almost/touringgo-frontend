import type { ItineraryFormData } from "./planificacionFormData";
import { barrioLabel } from "../../lib/format";
import {
  duracionDiasInclusiva,
  MAX_DIAS_VIAJE,
  MENSAJE_RANGO_INVALIDO,
} from "./lib/fechas";

export type FormErrors = Partial<
  Record<keyof ItineraryFormData, string>
>;

export function validateStep(formData: ItineraryFormData, step: number): FormErrors {
  const errors: FormErrors = {};

  switch (step) {
    case 0: 
      if (formData.barrio == null) 
        errors.barrio = "Seleccioná un barrio.";
      
      if (formData.puntoInicio == null) {
        errors.puntoInicio = "Seleccioná un punto de partida.";
      } else if (
        (formData.puntoInicio === "HospedajePropio" || formData.puntoInicio === "HospedajeSugerido") &&
        formData.hospedajeLugarGuid == null
      ) {
        errors.hospedajeLugarGuid = "Seleccioná un lugar de alojamiento de la lista.";
      } else if (
        (formData.puntoInicio === "HospedajeSugerido" || formData.puntoInicio === "HospedajePropio") &&
        formData.hospedajeLugarGuid != null &&
        formData.barrio != null &&
        formData.hospedajeBarrio != null &&
        formData.hospedajeBarrio !== formData.barrio
      ) {
        errors.hospedajeLugarGuid = `El alojamiento recomendado debe pertenecer al barrio seleccionado (${barrioLabel(formData.barrio)}).`;
      }

      break;

    case 1: 
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

    case 2: 
      if (formData.modalidadViaje == null) {
        errors.modalidadViaje = "Seleccioná una modalidad de viaje.";
      }

      if (formData.categoriasPrioritarias.length < 2 || formData.categoriasPrioritarias.length > 4) {
        errors.categoriasPrioritarias = "Seleccioná entre 2 y 4 categorías.";
      }

      break;
    
    case 3:
      if (formData.ritmoVisita == null) {
        errors.ritmoVisita = "Seleccioná el ritmo de la salida.";
      }
      if (formData.tipoTransporte == null) {
        errors.tipoTransporte = "Seleccioná un medio de transporte.";
      }
      if (formData.presupuestoNivel == null) {
        errors.presupuestoNivel = "Seleccioná un nivel de presupuesto.";
      }
  }

  return errors;
}