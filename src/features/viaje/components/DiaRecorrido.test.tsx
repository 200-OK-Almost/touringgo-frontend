import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { LugarDetalleDto } from "../../../api/types";
import type { ParadaViewModel } from "../types";
import DiaRecorrido from "./DiaRecorrido";

interface MetricasParada {
  distanciaMetrosDesdeAnterior?: number | null;
  cuadrasDesdeAnterior?: number | null;
  minutosAPieDesdeAnterior?: number | null;
}

function crearLugar(
  nombre: string,
  coordenadas?: { latitud: number; longitud: number }
): LugarDetalleDto {
  return {
    id: `lugar-${nombre}`,
    nombre,
    direccion: "Av. Siempre Viva 123",
    puntuacion: 4.5,
    cantidadResenas: 10,
    categorias: [],
    fotos: [],
    ...(coordenadas ?? {}),
  } as unknown as LugarDetalleDto;
}

function crearParada(
  id: string,
  nombre: string,
  metricas: MetricasParada = {},
  coordenadas?: { latitud: number; longitud: number }
): ParadaViewModel {
  return {
    parada: {
      id,
      lugarId: `lugar-${nombre}`,
      turno: "Tarde",
      ordenParada: 1,
      horaInicio: "16:00",
      duracionMinutos: 60,
      origenParada: "Manual",
      ...metricas,
    } as ParadaViewModel["parada"],
    lugar: crearLugar(nombre, coordenadas),
  };
}

describe("DiaRecorrido", () => {
  it("muestra el tramo desde el punto de partida a la primera parada", () => {
    render(
      <DiaRecorrido
        paradasViewModel={[
          crearParada("p1", "Museo", {
            distanciaMetrosDesdeAnterior: 650,
            cuadrasDesdeAnterior: 7,
            minutosAPieDesdeAnterior: 8,
          }),
        ]}
        lugarPartida={crearLugar("Hotel")}
      />
    );

    expect(
      screen.getByText("8 min a pie · 650 m · 7 cuadras")
    ).toBeInTheDocument();
  });

  it("muestra los tramos entre paradas consecutivas", () => {
    render(
      <DiaRecorrido
        paradasViewModel={[
          crearParada("p1", "Museo", {
            distanciaMetrosDesdeAnterior: 650,
            minutosAPieDesdeAnterior: 8,
          }),
          crearParada("p2", "Cafe", {
            distanciaMetrosDesdeAnterior: 1200,
            minutosAPieDesdeAnterior: 14,
          }),
        ]}
        lugarPartida={crearLugar("Hotel")}
      />
    );

    expect(screen.getByText("8 min a pie · 650 m · 7 cuadras")).toBeInTheDocument();
    expect(screen.getByText("14 min a pie · 1.2 km · 12 cuadras")).toBeInTheDocument();
  });

  it("no muestra el tramo inicial sin punto de partida", () => {
    render(
      <DiaRecorrido
        paradasViewModel={[
          crearParada("p1", "Museo", {
            distanciaMetrosDesdeAnterior: 650,
            minutosAPieDesdeAnterior: 8,
          }),
        ]}
        lugarPartida={null}
      />
    );

    expect(document.querySelector(".tramo-recorrido")).toBeNull();
  });

  it("no muestra tramos sin metricas ni coordenadas", () => {
    render(
      <DiaRecorrido
        paradasViewModel={[
          crearParada("p1", "Museo"),
          crearParada("p2", "Cafe"),
        ]}
        lugarPartida={crearLugar("Hotel")}
      />
    );

    expect(document.querySelector(".tramo-recorrido")).toBeNull();
  });

  it("calcula el tramo entre paradas cuando faltan metricas", () => {
    render(
      <DiaRecorrido
        paradasViewModel={[
          crearParada("p1", "Museo", {}, { latitud: -34.6, longitud: -58.4 }),
          crearParada("p2", "Cafe", {}, { latitud: -34.601, longitud: -58.4 }),
        ]}
        lugarPartida={null}
      />
    );

    expect(screen.getByText("1 min a pie · 111 m · 1 cuadra")).toBeInTheDocument();
  });
});
