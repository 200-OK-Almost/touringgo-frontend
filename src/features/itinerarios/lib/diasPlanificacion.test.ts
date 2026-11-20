import { describe, expect, it } from "vitest";
import type { CategoriaDto } from "../../../api/types";
import type { DiaPlanificacion } from "../planificacionFormData";
import {
  construirDias,
  diaEstaCompleto,
  diasConPreferenciasFaltantes,
  diasFaltantes,
  preferenciasDiaCompletas,
} from "./diasPlanificacion";

const CATEGORIAS: CategoriaDto[] = [
  { id: 1, codigo: "cafe_especialidad", nombre: "Café de especialidad" },
  { id: 2, codigo: "museos_galerias", nombre: "Museos y galerías" },
];

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
    modalidadViaje: barrio ? "Solo" : null,
    categoriasPrioritarias: [],
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

  it("considera incompleto un hospedaje de otro barrio", () => {
    const diaConHospedaje: DiaPlanificacion = {
      ...dia("2026-11-18", 1, "Palermo"),
      puntoInicio: "HospedajePropio",
      hospedajeLugarGuid: "hotel-1",
      hospedajeBarrio: "Recoleta",
    };

    expect(diaEstaCompleto(diaConHospedaje)).toBe(false);
  });

  it("detecta preferencias completas y faltantes por día", () => {
    const completo: DiaPlanificacion = {
      ...dia("2026-11-18", 1, "Palermo"),
      modalidadViaje: "Solo",
      categoriasPrioritarias: CATEGORIAS,
    };
    const incompleto = dia("2026-11-19", 2, "Recoleta");

    expect(preferenciasDiaCompletas(completo)).toBe(true);
    expect(preferenciasDiaCompletas(incompleto)).toBe(false);
    expect(
      diasConPreferenciasFaltantes([completo, incompleto])
    ).toEqual(["Día 2"]);
  });
});
