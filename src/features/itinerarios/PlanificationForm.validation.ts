import type { ItineraryFormData } from "./PlanificacionForm";
import { barrioLabel } from "../../lib/format";

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
        formData.puntoInicio === "HospedajeSugerido" &&
        formData.hospedajeLugarGuid != null &&
        formData.barrio != null &&
        formData.hospedajeBarrio != null &&
        formData.hospedajeBarrio !== formData.barrio
      ) {
        errors.hospedajeLugarGuid = `El alojamiento recomendado debe pertenecer al barrio seleccionado (${barrioLabel(formData.barrio)}).`;
      }

      break;

    case 1: 
      if (formData.cantidadDias == null) {
        errors.cantidadDias = "Seleccioná la duración de la salida";
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