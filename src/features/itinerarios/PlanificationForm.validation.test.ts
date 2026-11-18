import { describe, expect, it } from "vitest";
import {
  crearItineraryFormDataInicial,
  type DiaPlanificacion,
  type ItineraryFormData,
} from "./planificacionFormData";
import { validateStep } from "./PlanificationForm.validation";

function dia(
  fecha: string,
  numero: number,
  barrio: DiaPlanificacion["barrio"] = null
): DiaPlanificacion {
  return {
    fecha,
    dia: numero,
    barrio,
    puntoInicio: barrio ? "NodoUrbano" : null,
    hospedajeLugarGuid: null,
    hospedajeBarrio: null,
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
