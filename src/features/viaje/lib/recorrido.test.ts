import { describe, expect, it } from "vitest";
import type { ParadaViewModel } from "../types";
import {
  formatearCuadras,
  formatearMetros,
  formatearMinutosAPie,
  formatearResumenDia,
  formatearTramo,
  resumirDia,
} from "./recorrido";

interface MetricasParada {
  distanciaMetrosDesdeAnterior?: number | null;
  cuadrasDesdeAnterior?: number | null;
  minutosAPieDesdeAnterior?: number | null;
}

function crearParada(metricas: MetricasParada = {}): ParadaViewModel {
  return {
    parada: {
      id: "parada-1",
      lugarId: "lugar-1",
      turno: "Tarde",
      ordenParada: 1,
      horaInicio: "16:00",
      duracionMinutos: 60,
      origenParada: "Manual",
      ...metricas,
    } as ParadaViewModel["parada"],
    lugar: {} as ParadaViewModel["lugar"],
  };
}

describe("formatearMetros", () => {
  it("oculta distancias invalidas", () => {
    expect(formatearMetros(null)).toBeNull();
    expect(formatearMetros(undefined)).toBeNull();
    expect(formatearMetros(0)).toBeNull();
    expect(formatearMetros(-5)).toBeNull();
  });

  it("formatea metros y kilometros", () => {
    expect(formatearMetros(650)).toBe("650 m");
    expect(formatearMetros(999)).toBe("999 m");
    expect(formatearMetros(1000)).toBe("1.0 km");
    expect(formatearMetros(1800)).toBe("1.8 km");
  });
});

describe("formatearMinutosAPie", () => {
  it("oculta valores invalidos", () => {
    expect(formatearMinutosAPie(null)).toBeNull();
    expect(formatearMinutosAPie(undefined)).toBeNull();
    expect(formatearMinutosAPie(0)).toBeNull();
    expect(formatearMinutosAPie(-2)).toBeNull();
  });

  it("formatea minutos caminando", () => {
    expect(formatearMinutosAPie(1)).toBe("1 min a pie");
    expect(formatearMinutosAPie(8)).toBe("8 min a pie");
  });
});

describe("formatearCuadras", () => {
  it("oculta valores invalidos", () => {
    expect(formatearCuadras(null)).toBeNull();
    expect(formatearCuadras(undefined)).toBeNull();
    expect(formatearCuadras(0)).toBeNull();
    expect(formatearCuadras(-1)).toBeNull();
  });

  it("formatea singular y plural", () => {
    expect(formatearCuadras(1)).toBe("1 cuadra");
    expect(formatearCuadras(7)).toBe("7 cuadras");
  });
});

describe("formatearTramo", () => {
  it("combina solo los valores disponibles", () => {
    expect(
      formatearTramo({
        minutosAPie: 8,
        distanciaMetros: 650,
        cuadras: 7,
      })
    ).toBe("8 min a pie · 650 m · 7 cuadras");

    expect(formatearTramo({ minutosAPie: 5 })).toBe("5 min a pie");
    expect(
      formatearTramo({ distanciaMetros: 1200, cuadras: 12 })
    ).toBe("1.2 km · 12 cuadras");
  });

  it("devuelve null sin valores validos", () => {
    expect(formatearTramo({})).toBeNull();
    expect(
      formatearTramo({
        distanciaMetros: null,
        cuadras: null,
        minutosAPie: null,
      })
    ).toBeNull();
  });
});

describe("resumirDia", () => {
  it("devuelve un resumen vacio sin paradas", () => {
    expect(resumirDia(null)).toEqual({
      totalParadas: 0,
      totalMinutosAPie: 0,
      totalMetros: 0,
    });

    expect(resumirDia([])).toEqual({
      totalParadas: 0,
      totalMinutosAPie: 0,
      totalMetros: 0,
    });
  });

  it("suma tramos validos", () => {
    const resumen = resumirDia([
      crearParada({ distanciaMetrosDesdeAnterior: 500, minutosAPieDesdeAnterior: 6 }),
      crearParada({ distanciaMetrosDesdeAnterior: 1200, minutosAPieDesdeAnterior: 14 }),
      crearParada({
        distanciaMetrosDesdeAnterior: null,
        minutosAPieDesdeAnterior: null,
      }),
    ]);

    expect(resumen.totalParadas).toBe(3);
    expect(resumen.totalMinutosAPie).toBe(20);
    expect(resumen.totalMetros).toBe(1700);
  });
});

describe("formatearResumenDia", () => {
  it("devuelve null cuando no hay paradas", () => {
    expect(formatearResumenDia(resumirDia(null))).toBeNull();
  });

  it("formatea el resumen del dia", () => {
    expect(
      formatearResumenDia({
        totalParadas: 1,
        totalMinutosAPie: 6,
        totalMetros: 500,
      })
    ).toBe("1 parada · 6 min a pie · 500 m");

    expect(
      formatearResumenDia({
        totalParadas: 3,
        totalMinutosAPie: 20,
        totalMetros: 1700,
      })
    ).toBe("3 paradas · 20 min a pie · 1.7 km");

    expect(
      formatearResumenDia({
        totalParadas: 2,
        totalMinutosAPie: 0,
        totalMetros: 0,
      })
    ).toBe("2 paradas");
  });
});
