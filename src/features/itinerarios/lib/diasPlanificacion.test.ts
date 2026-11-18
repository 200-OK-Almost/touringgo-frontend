import { describe, expect, it } from "vitest";
import type { DiaPlanificacion } from "../planificacionFormData";
import {
  construirDias,
  diaEstaCompleto,
  diasFaltantes,
} from "./diasPlanificacion";

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

describe("diasPlanificacion", () => {
  it("crea un día por cada fecha inclusiva", () => {
    const dias = construirDias("2026-11-18", "2026-11-20");

    expect(dias.map((d) => d.fecha)).toEqual([
      "2026-11-18",
      "2026-11-19",
      "2026-11-20",
    ]);
    expect(dias.map((d) => d.dia)).toEqual([1, 2, 3]);
  });

  it("conserva las selecciones de las fechas que se mantienen", () => {
    const previos = [
      dia("2026-11-18", 1, "Palermo"),
      dia("2026-11-19", 2, "Recoleta"),
    ];

    const dias = construirDias("2026-11-19", "2026-11-20", previos);

    expect(dias[0].fecha).toBe("2026-11-19");
    expect(dias[0].barrio).toBe("Recoleta");
    expect(dias[1].barrio).toBeNull();
  });

  it("descarta los días que salen del rango", () => {
    const previos = [
      dia("2026-11-17", 1, "SanTelmo"),
      dia("2026-11-18", 2, "Palermo"),
      dia("2026-11-19", 3, "Recoleta"),
    ];

    const dias = construirDias("2026-11-18", "2026-11-19", previos);

    expect(dias.map((d) => d.barrio)).toEqual(["Palermo", "Recoleta"]);
  });

  it("agrega días vacíos cuando el rango se agranda", () => {
    const previos = [dia("2026-11-18", 1, "Palermo")];

    const dias = construirDias("2026-11-18", "2026-11-20", previos);

    expect(dias[0].barrio).toBe("Palermo");
    expect(dias[1].barrio).toBeNull();
    expect(dias[2].barrio).toBeNull();
  });

  it("devuelve vacío si el rango es inválido", () => {
    expect(construirDias("2026-11-20", "2026-11-18")).toEqual([]);
    expect(construirDias(null, null)).toEqual([]);
    expect(construirDias("2026-11-18", "2026-11-26")).toEqual([]);
  });

  it("detecta días completos y faltantes", () => {
    const dias = [
      dia("2026-11-18", 1, "Palermo"),
      dia("2026-11-19", 2),
    ];

    expect(diaEstaCompleto(dias[0])).toBe(true);
    expect(diaEstaCompleto(dias[1])).toBe(false);
    expect(diasFaltantes(dias)).toEqual(["Día 2"]);
  });
});
