import { beforeEach, describe, expect, it } from "vitest";
import { crearItineraryFormDataInicial } from "../planificacionFormData";
import {
  esBorradorConDatos,
  guardarPlanificacionDraft,
  leerPlanificacionDraft,
  limpiarPlanificacionDraft,
} from "./usePlanificacionDraft";

const STORAGE_KEY = "touringgo:planificacion-draft:v1";

describe("usePlanificacionDraft", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("guarda y recupera un borrador con datos", () => {
    const formData = {
      ...crearItineraryFormDataInicial(),
      fechaInicio: "2026-11-18",
      fechaFin: "2026-11-18",
      duracion: 1,
      dias: [
        {
          fecha: "2026-11-18",
          dia: 1,
          barrio: "Palermo" as const,
          puntoInicio: "NodoUrbano" as const,
          hospedajeLugarGuid: null,
          hospedajeBarrio: null,
          modalidadViaje: "Solo" as const,
          categoriasPrioritarias: [],
          ritmoVisita: "Activo" as const,
          presupuestoNivel: "Equilibrado" as const,
        },
      ],
    };

    guardarPlanificacionDraft(formData, 1);

    const draft = leerPlanificacionDraft();
    expect(draft?.formData.dias[0].barrio).toBe("Palermo");
    expect(draft?.formData.dias[0].ritmoVisita).toBe("Activo");
    expect(draft?.formData.dias[0].presupuestoNivel).toBe("Equilibrado");
    expect(draft?.currentStepCounter).toBe(1);
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
      fechaInicio: "2026-11-18",
      fechaFin: "2026-11-18",
      duracion: 1,
      dias: [
        {
          fecha: "2026-11-18",
          dia: 1,
          barrio: "Recoleta" as const,
          puntoInicio: "NodoUrbano" as const,
          hospedajeLugarGuid: null,
          hospedajeBarrio: null,
          modalidadViaje: "Solo" as const,
          categoriasPrioritarias: [],
          ritmoVisita: null,
          presupuestoNivel: null,
        },
      ],
    };

    guardarPlanificacionDraft(formData, 1);
    limpiarPlanificacionDraft();

    expect(leerPlanificacionDraft()).toBeNull();
  });

  it("descarta un borrador con versión desconocida", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: 99, formData: {}, currentStepCounter: 0 })
    );

    expect(leerPlanificacionDraft()).toBeNull();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("migra un borrador v1 al modelo de días", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        currentStepCounter: 1,
        formData: {
          barrio: "Recoleta",
          puntoInicio: "NodoUrbano",
          hospedajeLugarGuid: null,
          hospedajeBarrio: null,
          fechaInicio: "2026-11-18",
          fechaFin: "2026-11-19",
          disponibilidadDiaria: "DiaCompleto",
          modalidadViaje: "Solo",
          categoriasPrioritarias: [],
          ritmoVisita: null,
          presupuestoNivel: null,
          tipoTransporte: null,
        },
      })
    );

    const draft = leerPlanificacionDraft();

    expect(draft?.version).toBe(4);
    expect(draft?.currentStepCounter).toBe(0);
    expect(draft?.formData.dias).toHaveLength(2);
    expect(draft?.formData.dias[0].barrio).toBe("Recoleta");
    expect(draft?.formData.dias[1].barrio).toBeNull();
    expect(draft?.formData.dias[0].modalidadViaje).toBe("Solo");
  });

  it("migra un borrador v2 copiando las preferencias globales a los días", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 2,
        currentStepCounter: 2,
        formData: {
          fechaInicio: "2026-11-18",
          fechaFin: "2026-11-19",
          disponibilidadDiaria: "DiaCompleto",
          modalidadViaje: "Amigos",
          categoriasPrioritarias: [
            {
              id: 1,
              codigo: "cafe_especialidad",
              nombre: "Café de especialidad",
            },
          ],
          ritmoVisita: "Activo",
          presupuestoNivel: "Equilibrado",
          tipoTransporte: null,
          dias: [
            {
              fecha: "2026-11-18",
              dia: 1,
              barrio: "Palermo",
              puntoInicio: "NodoUrbano",
              hospedajeLugarGuid: null,
              hospedajeBarrio: null,
            },
            {
              fecha: "2026-11-19",
              dia: 2,
              barrio: "Recoleta",
              puntoInicio: "NodoUrbano",
              hospedajeLugarGuid: null,
              hospedajeBarrio: null,
            },
          ],
        },
      })
    );

    const draft = leerPlanificacionDraft();

    expect(draft?.version).toBe(4);
    expect(draft?.currentStepCounter).toBe(2);
    expect(draft?.formData.dias).toHaveLength(2);
    expect(draft?.formData.dias).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          dia: 1,
          modalidadViaje: "Amigos",
          categoriasPrioritarias: [
            expect.objectContaining({ codigo: "cafe_especialidad" }),
          ],
          ritmoVisita: "Activo",
          presupuestoNivel: "Equilibrado",
        }),
        expect.objectContaining({
          dia: 2,
          modalidadViaje: "Amigos",
          categoriasPrioritarias: [
            expect.objectContaining({ codigo: "cafe_especialidad" }),
          ],
          ritmoVisita: "Activo",
          presupuestoNivel: "Equilibrado",
        }),
      ])
    );
  });

  it("migra un borrador v3 copiando el ritmo y presupuesto globales a los días", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 3,
        currentStepCounter: 3,
        formData: {
          duracion: 2,
          fechaInicio: "2026-11-18",
          fechaFin: "2026-11-19",
          disponibilidadDiaria: "DiaCompleto",
          ritmoVisita: "Activo",
          presupuestoNivel: "Equilibrado",
          tipoTransporte: null,
          dias: [
            {
              fecha: "2026-11-18",
              dia: 1,
              barrio: "Palermo",
              puntoInicio: "NodoUrbano",
              hospedajeLugarGuid: null,
              hospedajeBarrio: null,
              modalidadViaje: "Solo",
              categoriasPrioritarias: [],
              ritmoVisita: null,
              presupuestoNivel: null,
            },
            {
              fecha: "2026-11-19",
              dia: 2,
              barrio: "Recoleta",
              puntoInicio: "NodoUrbano",
              hospedajeLugarGuid: null,
              hospedajeBarrio: null,
              modalidadViaje: "Solo",
              categoriasPrioritarias: [],
              ritmoVisita: null,
              presupuestoNivel: null,
            },
          ],
        },
      })
    );

    const draft = leerPlanificacionDraft();

    expect(draft?.version).toBe(4);
    expect(draft?.currentStepCounter).toBe(2);
    expect(draft?.formData.dias[0].ritmoVisita).toBe("Activo");
    expect(draft?.formData.dias[0].presupuestoNivel).toBe("Equilibrado");
    expect(draft?.formData.dias[1].ritmoVisita).toBe("Activo");
    expect(draft?.formData.dias[1].presupuestoNivel).toBe("Equilibrado");
  });
});
