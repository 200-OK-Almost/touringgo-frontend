import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { ItinerarioViewModel, ParadaViewModel } from "../../../types";
import RecorridoPanel from "./RecorridoPanel";

function crearParada(metricas: {
  distanciaMetrosDesdeAnterior?: number;
  minutosAPieDesdeAnterior?: number;
}): ParadaViewModel {
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
    },
    lugar: {
      id: "lugar-1",
      nombre: "Museo de prueba",
      direccion: "Av. Siempre Viva 123",
      categorias: [],
      fotos: [],
    } as unknown as ParadaViewModel["lugar"],
  };
}

function crearItinerario(paradas: ParadaViewModel[]): ItinerarioViewModel {
  return {
    itinerario: {
      id: "itinerario-1",
      viajeId: "viaje-1",
      numeroDia: 1,
      fecha: null,
      origenTipo: "Lugar",
      origenDescripcion: null,
      origenLatitud: null,
      origenLongitud: null,
      version: null,
      paradas: paradas.map((parada) => parada.parada),
    },
    paradas,
  } as unknown as ItinerarioViewModel;
}

describe("RecorridoPanel", () => {
  it("muestra el resumen del dia con paradas", () => {
    render(
      <RecorridoPanel
        dias={[]}
        diaSeleccionado={1}
        onDiaChange={vi.fn()}
        itinerarioActual={crearItinerario([
          crearParada({
            distanciaMetrosDesdeAnterior: 500,
            minutosAPieDesdeAnterior: 6,
          }),
        ])}
        lugarPartida={null}
      />
    );

    expect(screen.getByText("Resumen del día")).toBeInTheDocument();
    expect(
      screen.getByText("1 parada · 6 min a pie · 500 m")
    ).toBeInTheDocument();
  });

  it("muestra el mensaje sin paradas", () => {
    render(
      <RecorridoPanel
        dias={[]}
        diaSeleccionado={1}
        onDiaChange={vi.fn()}
        itinerarioActual={crearItinerario([])}
        lugarPartida={null}
      />
    );

    expect(
      screen.getByText("Este día todavía no tiene paradas")
    ).toBeInTheDocument();
  });
});
