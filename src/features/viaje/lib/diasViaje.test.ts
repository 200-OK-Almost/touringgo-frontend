import { describe, expect, it } from "vitest";
import {
  construirDiasViaje,
  MAX_DIAS_VISIBLES,
  obtenerBarriosPorDia,
} from "./diasViaje";

describe("construirDiasViaje", () => {
  it("genera un día desde las fechas", () => {
    const resultado = construirDiasViaje("2026-03-10", "2026-03-10", null);

    expect(resultado.dias).toEqual([
      { numeroDia: 1, fecha: "2026-03-10", tieneItinerario: false },
    ]);
    expect(resultado.warning).toBeNull();
  });

  it("genera cuatro días inclusivos con fechas reales", () => {
    const resultado = construirDiasViaje("2026-03-10", "2026-03-13", [
      { numeroDia: 1, fecha: "2026-03-10" },
      { numeroDia: 3, fecha: "2026-03-12" },
    ]);

    expect(resultado.dias.map((dia) => dia.numeroDia)).toEqual([1, 2, 3, 4]);
    expect(resultado.dias.map((dia) => dia.fecha)).toEqual([
      "2026-03-10",
      "2026-03-11",
      "2026-03-12",
      "2026-03-13",
    ]);
    expect(resultado.dias.map((dia) => dia.tieneItinerario)).toEqual([
      true,
      false,
      true,
      false,
    ]);
    expect(resultado.warning).toBeNull();
  });

  it("genera siete días sin warning", () => {
    const resultado = construirDiasViaje("2026-03-10", "2026-03-16", null);

    expect(resultado.dias).toHaveLength(7);
    expect(resultado.warning).toBeNull();
  });

  it("usa los itinerarios cuando no hay fechas", () => {
    const resultado = construirDiasViaje(null, null, [
      { numeroDia: 1, fecha: "2026-03-10" },
      { numeroDia: 2, fecha: "2026-03-11" },
    ]);

    expect(resultado.dias).toHaveLength(2);
    expect(resultado.dias[1].fecha).toBe("2026-03-11");
  });

  it("devuelve un día vacío si no hay fechas ni itinerarios", () => {
    const resultado = construirDiasViaje(null, null, null);

    expect(resultado.dias).toEqual([
      { numeroDia: 1, fecha: null, tieneItinerario: false },
    ]);
  });

  it("advierte cuando un viaje legacy supera los siete días", () => {
    const resultado = construirDiasViaje("2026-03-10", "2026-03-17", null);

    expect(resultado.dias).toHaveLength(8);
    expect(resultado.warning).toContain("más que el máximo recomendado");
  });

  it("limita la visualización de viajes legacy muy largos", () => {
    const resultado = construirDiasViaje("2026-03-10", "2026-04-10", null);

    expect(resultado.dias).toHaveLength(MAX_DIAS_VISIBLES);
    expect(resultado.warning).toContain("Se muestran los primeros");
  });

  it("usa el fallback cuando las fechas están invertidas", () => {
    const resultado = construirDiasViaje("2026-03-10", "2026-03-09", [
      { numeroDia: 2, fecha: "2026-03-11" },
    ]);

    expect(resultado.dias).toEqual([
      { numeroDia: 2, fecha: "2026-03-11", tieneItinerario: true },
    ]);
  });
});

describe("obtenerBarriosPorDia", () => {
  it("usa los barrios configurados por día", () => {
    const barrios = obtenerBarriosPorDia("Palermo", [
      { numeroDia: 2, barrio: "Recoleta" },
      { numeroDia: 1, barrio: "Palermo" },
    ]);

    expect(barrios).toEqual([
      { numeroDia: 1, barrio: "Palermo" },
      { numeroDia: 2, barrio: "Recoleta" },
    ]);
  });

  it("usa el barrio único como fallback", () => {
    expect(obtenerBarriosPorDia("SanTelmo", null)).toEqual([
      { numeroDia: 1, barrio: "SanTelmo" },
    ]);
  });
});
