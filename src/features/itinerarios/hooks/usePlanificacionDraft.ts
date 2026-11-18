import type { BarrioCaba } from "../../../api/types";
import {
  crearItineraryFormDataInicial,
  type ItineraryFormData,
} from "../planificacionFormData";
import type { PuntoInicio } from "../types";
import { construirDias } from "../lib/diasPlanificacion";

const STORAGE_KEY = "touringgo:planificacion-draft:v1";
const VERSION = 2;
const VERSION_LEGACY = 1;

export interface PlanificacionDraft {
  version: number;
  formData: ItineraryFormData;
  currentStepCounter: number;
  updatedAt: string;
}

interface LegacyFormData {
  barrio?: BarrioCaba | null;
  puntoInicio?: PuntoInicio | null;
  hospedajeLugarGuid?: string | null;
  hospedajeBarrio?: BarrioCaba | null;
  fechaInicio?: string | null;
  fechaFin?: string | null;
  [key: string]: unknown;
}

function normalizarFormData(
  raw: Partial<ItineraryFormData> | LegacyFormData
): ItineraryFormData {
  const {
    barrio,
    puntoInicio,
    hospedajeLugarGuid,
    hospedajeBarrio,
    ...resto
  } = raw as LegacyFormData;

  const base = {
    ...crearItineraryFormDataInicial(),
    ...(resto as Partial<ItineraryFormData>),
  };

  const diasPrevios = Array.isArray(base.dias) ? base.dias : [];
  const dias = construirDias(base.fechaInicio, base.fechaFin, diasPrevios);

  if (dias.length > 0 && barrio != null) {
    dias[0] = {
      ...dias[0],
      barrio,
      puntoInicio: puntoInicio ?? null,
      hospedajeLugarGuid: hospedajeLugarGuid ?? null,
      hospedajeBarrio: hospedajeBarrio ?? null,
    };
  }

  return {
    ...base,
    dias,
    duracion: dias.length,
    categoriasPrioritarias: Array.isArray(base.categoriasPrioritarias)
      ? base.categoriasPrioritarias
      : [],
  };
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
      (parsed.version !== VERSION && parsed.version !== VERSION_LEGACY) ||
      typeof parsed.currentStepCounter !== "number" ||
      !parsed.formData ||
      typeof parsed.formData !== "object"
    ) {
      limpiarPlanificacionDraft();
      return null;
    }

    const formData = normalizarFormData(
      parsed.formData as Partial<ItineraryFormData> | LegacyFormData
    );

    return {
      version: VERSION,
      formData,
      currentStepCounter:
        parsed.version === VERSION_LEGACY ? 0 : parsed.currentStepCounter,
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
    formData.dias.some(
      (dia) =>
        dia.barrio ||
        dia.puntoInicio ||
        dia.hospedajeLugarGuid ||
        dia.hospedajeBarrio
    ) ||
      formData.fechaInicio ||
      formData.fechaFin ||
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
