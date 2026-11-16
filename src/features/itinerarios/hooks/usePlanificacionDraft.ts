import {
  crearItineraryFormDataInicial,
  type ItineraryFormData,
} from "../planificacionFormData";

const STORAGE_KEY = "touringgo:planificacion-draft:v1";
const VERSION = 1;

export interface PlanificacionDraft {
  version: number;
  formData: ItineraryFormData;
  currentStepCounter: number;
  updatedAt: string;
}

export function leerPlanificacionDraft(): PlanificacionDraft | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<PlanificacionDraft> | null;

    if (
      !parsed ||
      parsed.version !== VERSION ||
      typeof parsed.currentStepCounter !== "number" ||
      !parsed.formData ||
      typeof parsed.formData !== "object"
    ) {
      limpiarPlanificacionDraft();
      return null;
    }

    const formData = {
      ...crearItineraryFormDataInicial(),
      ...parsed.formData,
      categoriasPrioritarias: Array.isArray(parsed.formData.categoriasPrioritarias)
        ? parsed.formData.categoriasPrioritarias
        : [],
    };

    return {
      version: VERSION,
      formData,
      currentStepCounter: parsed.currentStepCounter,
      updatedAt:
        typeof parsed.updatedAt === "string"
          ? parsed.updatedAt
          : new Date(0).toISOString(),
    };
  } catch {
    limpiarPlanificacionDraft();
    return null;
  }
}

export function guardarPlanificacionDraft(
  formData: ItineraryFormData,
  currentStepCounter: number
): void {
  try {
    if (!esBorradorConDatos(formData, currentStepCounter)) {
      limpiarPlanificacionDraft();
      return;
    }

    const draft: PlanificacionDraft = {
      version: VERSION,
      formData,
      currentStepCounter,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // Si localStorage no está disponible, el wizard sigue funcionando en memoria.
  }
}

export function limpiarPlanificacionDraft(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Sin localStorage no hay borrador que limpiar.
  }
}

export function esBorradorConDatos(
  formData: ItineraryFormData,
  currentStepCounter: number
): boolean {
  if (currentStepCounter > 0) {
    return true;
  }

  return Boolean(
    formData.barrio ||
      formData.puntoInicio ||
      formData.hospedajeLugarGuid ||
      formData.hospedajeBarrio ||
      formData.cantidadDias ||
      formData.disponibilidadDiaria ||
      formData.modalidadViaje ||
      formData.ritmoVisita ||
      formData.presupuestoNivel ||
      formData.tipoTransporte ||
      formData.categoriasPrioritarias.length > 0
  );
}

export function usePlanificacionDraft() {
  const draft = leerPlanificacionDraft();

  return {
    draft,
    hasDraft: draft !== null,
    saveDraft: guardarPlanificacionDraft,
    clearDraft: limpiarPlanificacionDraft,
  };
}
