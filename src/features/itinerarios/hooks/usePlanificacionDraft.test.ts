import { beforeEach, describe, expect, it } from "vitest";
import { crearItineraryFormDataInicial } from "../planificacionFormData";
import {
  esBorradorConDatos,
  guardarPlanificacionDraft,
  leerPlanificacionDraft,
  limpiarPlanificacionDraft,
} from "./usePlanificacionDraft";

describe("usePlanificacionDraft", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("guarda y recupera un borrador con datos", () => {
    const formData = {
      ...crearItineraryFormDataInicial(),
      barrio: "Palermo" as const,
    };

    guardarPlanificacionDraft(formData, 0);

    const draft = leerPlanificacionDraft();
    expect(draft?.formData.barrio).toBe("Palermo");
    expect(draft?.currentStepCounter).toBe(0);
  });

  it("no guarda un formulario vacío en el paso 0", () => {
    guardarPlanificacionDraft(crearItineraryFormDataInicial(), 0);

    expect(leerPlanificacionDraft()).toBeNull();
  });

  it("considera borrador a cualquier formulario con paso avanzado", () => {
    expect(esBorradorConDatos(crearItineraryFormDataInicial(), 1)).toBe(true);
  });

  it("limpia el borrador", () => {
    const formData = {
      ...crearItineraryFormDataInicial(),
      barrio: "Recoleta" as const,
    };

    guardarPlanificacionDraft(formData, 0);
    limpiarPlanificacionDraft();

    expect(leerPlanificacionDraft()).toBeNull();
  });

  it("descarta un borrador con versión desconocida", () => {
    localStorage.setItem(
      "touringgo:planificacion-draft:v1",
      JSON.stringify({ version: 99, formData: {}, currentStepCounter: 0 })
    );

    expect(leerPlanificacionDraft()).toBeNull();
    expect(localStorage.getItem("touringgo:planificacion-draft:v1")).toBeNull();
  });
});
