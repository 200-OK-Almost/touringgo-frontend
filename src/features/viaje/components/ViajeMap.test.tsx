import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";
import type { ItinerarioViewModel } from "../types";
import ViajeMap from "./ViajeMap";

const { mapMock } = vi.hoisted(() => ({
  mapMock: {
    fitBounds: vi.fn(),
    flyTo: vi.fn(),
    getSize: () => ({ x: 800, y: 600 }),
    getZoom: () => 13,
    getMinZoom: () => 1,
    getMaxZoom: () => 18,
  },
}));

vi.mock("react-leaflet", () => ({
  MapContainer: ({ children }: { children?: ReactNode }) => (
    <div>{children}</div>
  ),
  Marker: () => null,
  Polyline: () => null,
  TileLayer: () => null,
  useMap: () => mapMock,
  useMapEvents: () => undefined,
}));

function crearItinerario(cantidadParadas: number): ItinerarioViewModel {
  return {
    itinerario: {
      id: "itinerario-1",
      viajeId: "viaje-1",
      numeroDia: 1,
      fecha: "2026-11-25",
      origenTipo: "Barrio",
      origenDescripcion: null,
      origenLatitud: null,
      origenLongitud: null,
      version: "1",
      paradas: [],
    },
    paradas: Array.from({ length: cantidadParadas }, (_, index) => ({
      parada: {
        id: `parada-${index + 1}`,
        lugarId: `lugar-${index + 1}`,
        turno: "Tarde",
        ordenParada: index + 1,
        horaInicio: "16:00",
        duracionMinutos: 60,
        origenParada: "Manual",
      },
      lugar: {
        id: `lugar-${index + 1}`,
        nombre: `Lugar ${index + 1}`,
        latitud: -34.6 - index * 0.01,
        longitud: -58.38 - index * 0.01,
      },
    })),
  } as unknown as ItinerarioViewModel;
}

describe("ViajeMap", () => {
  it("muestra la leyenda de trazado aproximado con varias paradas", () => {
    render(
      <ViajeMap
        itinerarioViewModel={crearItinerario(2)}
        panelWidth={480}
      />
    );

    expect(
      screen.getByText("Tramos aproximados en línea recta")
    ).toBeInTheDocument();
  });

  it("no muestra la leyenda con una sola parada", () => {
    render(
      <ViajeMap
        itinerarioViewModel={crearItinerario(1)}
        panelWidth={480}
      />
    );

    expect(
      screen.queryByText("Tramos aproximados en línea recta")
    ).not.toBeInTheDocument();
  });

  it("muestra un mensaje explícito cuando el día no tiene paradas", () => {
    render(
      <ViajeMap
        itinerarioViewModel={crearItinerario(0)}
        panelWidth={480}
      />
    );

    expect(
      screen.getByText("Este día todavía no tiene paradas.")
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Tramos aproximados en línea recta")
    ).not.toBeInTheDocument();
  });
});
