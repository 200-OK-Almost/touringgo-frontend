import type { ItineraryFormData } from "./PlanificacionForm";

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
        (formData.puntoInicio === "hospedajeDefinido" || formData.puntoInicio === "recomendarHospedaje") &&
        formData.hospedajeLugarGuid == null
      ) {
        errors.hospedajeLugarGuid = "Seleccioná un lugar de alojamiento de la lista.";
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

      break;
    
    case 3:
      if (formData.ritmoVisita == null) {
        errors.ritmoVisita = "Seleccioná el ritmo de la salida.";
      }
      if (formData.tipoTransporte == null) {
        errors.presupuestoNivel = "Seleccioná un medio de transporte.";
      }
      if (formData.presupuestoNivel == null) {
        errors.presupuestoNivel = "Seleccioná un nivel de presupuesto.";
      }
  }

  return errors;
}