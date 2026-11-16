import { describe, expect, it } from "vitest";
import {
  duracionDiasInclusiva,
  esRangoValido,
  formatearFechaConDia,
  formatearFechaCorta,
  formatearRangoFechas,
  parseFechaLocal,
} from "./fechas";

describe("parseFechaLocal", () => {
  it("parsea una fecha yyyy-MM-dd en hora local", () => {
    const fecha = parseFechaLocal("2026-03-10");

    expect(fecha?.getFullYear()).toBe(2026);
    expect(fecha?.getMonth()).toBe(2);
    expect(fecha?.getDate()).toBe(10);
  });

  it("rechaza fechas inexistentes", () => {
    expect(parseFechaLocal("2026-02-30")).toBeNull();
  });

  it("rechaza formatos inválidos y valores nulos", () => {
    expect(parseFechaLocal("10/03/2026")).toBeNull();
    expect(parseFechaLocal("")).toBeNull();
    expect(parseFechaLocal(null)).toBeNull();
  });
});

describe("duracionDiasInclusiva", () => {
  it.each([
    ["2026-03-10", "2026-03-10", 1],
    ["2026-03-10", "2026-03-12", 3],
    ["2026-03-10", "2026-03-16", 7],
    ["2026-03-10", "2026-03-17", 8],
    ["2026-03-10", "2026-03-09", 0],
  ])("calcula %s a %s como %i días", (inicio, fin, esperado) => {
    expect(duracionDiasInclusiva(inicio, fin)).toBe(esperado);
  });

  it("devuelve null si falta alguna fecha", () => {
    expect(duracionDiasInclusiva("2026-03-10", null)).toBeNull();
    expect(duracionDiasInclusiva(null, "2026-03-10")).toBeNull();
  });

  it("acepta objetos Date", () => {
    expect(
      duracionDiasInclusiva(new Date(2026, 2, 10), new Date(2026, 2, 12))
    ).toBe(3);
  });
});

describe("esRangoValido", () => {
  it.each([
    [0, false],
    [1, true],
    [7, true],
    [8, false],
  ])("con %i días devuelve %s", (dias, esperado) => {
    const fin = new Date(2026, 2, 10 + dias - 1);

    expect(esRangoValido(new Date(2026, 2, 10), fin)).toBe(esperado);
  });

  it("devuelve false con fechas faltantes", () => {
    expect(esRangoValido(null, "2026-03-10")).toBe(false);
    expect(esRangoValido("2026-03-10", null)).toBe(false);
  });
});

describe("formato de fechas", () => {
  it("formatea día y mes con dos dígitos", () => {
    expect(formatearFechaCorta("2026-03-05")).toBe("05/03");
  });

  it("formatea día de la semana y fecha", () => {
    expect(formatearFechaConDia("2026-03-11")).toBe("mié 11/03");
  });

  it("formatea un rango de varios días", () => {
    expect(formatearRangoFechas("2026-03-10", "2026-03-12")).toBe(
      "Del 10/03 al 12/03 · 3 días"
    );
  });

  it("formatea un rango de un solo día", () => {
    expect(formatearRangoFechas("2026-03-10", "2026-03-10")).toBe(
      "El 10/03 · 1 día"
    );
  });

  it("formatea un rango de siete días", () => {
    expect(formatearRangoFechas("2026-03-10", "2026-03-16")).toBe(
      "Del 10/03 al 16/03 · 7 días"
    );
  });

  it("indica qué fecha falta", () => {
    expect(formatearRangoFechas(null, "2026-03-10")).toBe(
      "Elegí la fecha de inicio"
    );
    expect(formatearRangoFechas("2026-03-10", null)).toBe(
      "Elegí la fecha de fin"
    );
  });

  it("avisa si el rango es inválido", () => {
    expect(formatearRangoFechas("2026-03-10", "2026-03-09")).toBe(
      "El rango de fechas no es válido"
    );
  });
});
