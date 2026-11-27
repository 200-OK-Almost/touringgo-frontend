import { describe, expect, it } from "vitest";
import type { CategoriaDto } from "../../api/types";
import {
  crearItineraryFormDataInicial,
  type DiaPlanificacion,
  type ItineraryFormData,
} from "./planificacionFormData";
import { validateStep } from "./PlanificationForm.validation";

const CATEGORIAS: CategoriaDto[] = [
  { id: 1, codigo: "cafe_especialidad", nombre: "Café de especialidad" },
  { id: 2, codigo: "museos_galerias", nombre: "Museos y galerías" },
];

function dia(
  fecha: string,
  numero: number,
  barrio: DiaPlanificacion["barrio"] = null,
  sobrescribir: Partial<DiaPlanificacion> = {}
): DiaPlanificacion {
  return {
    fecha,
    dia: numero,
    barrio,
    puntoInicio: barrio ? "NodoUrbano" : null,
    hospedajeLugarGuid: null,
    hospedajeBarrio: null,
    modalidadViaje: barrio ? "Solo" : null,
    categoriasPrioritarias: [],
    ritmoVisita: null,
    presupuestoNivel: null,
    ...sobrescribir,
  };
}

function formDataConDias(dias: DiaPlanificacion[]): ItineraryFormData {
  return {
    ...crearItineraryFormDataInicial(),
    fechaInicio: dias[0]?.fecha ?? null,
    fechaFin: dias[dias.length - 1]?.fecha ?? null,
    dias,
    duracion: dias.length,
  };
}

describe("validateStep — paso Barrio y punto de partida", () => {
  it("valida un solo día completo", () => {
    const errors = validateStep(
      formDataConDias([dia("2026-11-18", 1, "Palermo")]),
      1
    );

    expect(errors).toEqual({});
  });

  it("mantiene los errores por campo con un solo día incompleto", () => {
    const errors = validateStep(
      formDataConDias([dia("2026-11-18", 1)]),
      1
    );

    expect(errors.barrio).toBe("Seleccioná un barrio.");
    expect(errors.puntoInicio).toBe("Seleccioná un punto de partida.");
  });

  it("indica qué días faltan completar con varios días", () => {
    const errors = validateStep(
      formDataConDias([
        dia("2026-11-18", 1, "Palermo"),
        dia("2026-11-19", 2),
        dia("2026-11-20", 3),
      ]),
      1
    );

    expect(errors.dias).toBe("Faltan completar: Día 2, Día 3.");
  });

  it("no permite avanzar si falta el hospedaje", () => {
    const diaConHospedaje: DiaPlanificacion = {
      ...dia("2026-11-18", 1, "Palermo"),
      puntoInicio: "HospedajePropio",
    };

    const errors = validateStep(
      formDataConDias([diaConHospedaje]),
      1
    );

    expect(errors.hospedajeLugarGuid).toBe(
      "Seleccioná un lugar de alojamiento de la lista."
    );
  });
});

describe("validateStep — paso Intereses y estilo", () => {
  it("valida un solo día completo", () => {
    const errors = validateStep(
      formDataConDias([
        dia("2026-11-18", 1, "Palermo", {
          modalidadViaje: "Solo",
          categoriasPrioritarias: CATEGORIAS,
          ritmoVisita: "Activo",
          presupuestoNivel: "Equilibrado",
        }),
      ]),
      2
    );

    expect(errors).toEqual({});
  });

  it("mantiene los errores por campo con un solo día incompleto", () => {
    const errors = validateStep(
      formDataConDias([
        dia("2026-11-18", 1, "Palermo", { modalidadViaje: null }),
      ]),
      2
    );

    expect(errors.modalidadViaje).toBe("Seleccioná una modalidad de viaje.");
    expect(errors.categoriasPrioritarias).toBe(
      "Seleccioná entre 2 y 4 categorías."
    );
    expect(errors.ritmoVisita).toBe("Seleccioná el ritmo de la salida.");
    expect(errors.presupuestoNivel).toBe(
      "Seleccioná un nivel de presupuesto."
    );
  });

  it("indica qué días faltan completar con varios días", () => {
    const errors = validateStep(
      formDataConDias([
        dia("2026-11-18", 1, "Palermo", {
          modalidadViaje: "Solo",
          categoriasPrioritarias: CATEGORIAS,
          ritmoVisita: "Activo",
          presupuestoNivel: "Equilibrado",
        }),
        dia("2026-11-19", 2, "Recoleta", {
          modalidadViaje: "Familia",
        }),
      ]),
      2
    );

    expect(errors.dias).toBe("Faltan completar: Día 2.");
  });

  it("detecta días incompletos por falta de ritmo o presupuesto", () => {
    const errors = validateStep(
      formDataConDias([
        dia("2026-11-18", 1, "Palermo", {
          modalidadViaje: "Solo",
          categoriasPrioritarias: CATEGORIAS,
          ritmoVisita: "Activo",
          presupuestoNivel: "Equilibrado",
        }),
        dia("2026-11-19", 2, "Recoleta", {
          modalidadViaje: "Familia",
          categoriasPrioritarias: CATEGORIAS,
          ritmoVisita: "Activo",
        }),
      ]),
      2
    );

    expect(errors.dias).toBe("Faltan completar: Día 2.");
  });

  it("valida varios días completos", () => {
    const errors = validateStep(
      formDataConDias([
        dia("2026-11-18", 1, "Palermo", {
          modalidadViaje: "Solo",
          categoriasPrioritarias: CATEGORIAS,
          ritmoVisita: "Activo",
          presupuestoNivel: "Equilibrado",
        }),
        dia("2026-11-19", 2, "Recoleta", {
          modalidadViaje: "Familia",
          categoriasPrioritarias: CATEGORIAS,
          ritmoVisita: "Tranquilo",
          presupuestoNivel: "Economico",
        }),
      ]),
      2
    );

    expect(errors).toEqual({});
  });
});
