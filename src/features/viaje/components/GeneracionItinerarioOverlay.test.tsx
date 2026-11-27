import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import GeneracionItinerarioOverlay from "./GeneracionItinerarioOverlay";

describe("GeneracionItinerarioOverlay", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("muestra el estado y los pasos de generación", () => {
    render(<GeneracionItinerarioOverlay estado="Borrador" />);

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Estamos armando tu itinerario" })
    ).toBeInTheDocument();
    expect(screen.getByText("Leyendo tus preferencias")).toBeInTheDocument();
    expect(
      screen.getByText(/Estamos preparando tu viaje/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Puede tardar unos segundos. No cierres esta pestaña."
      )
    ).toBeInTheDocument();
  });

  it("avanza el paso activo con el tiempo", () => {
    render(<GeneracionItinerarioOverlay estado="EnPlanificacion" />);

    expect(
      screen.getByText("Leyendo tus preferencias").closest("li")
    ).toHaveAttribute("aria-current", "step");

    act(() => {
      vi.advanceTimersByTime(2200);
    });

    expect(
      screen.getByText("Leyendo tus preferencias").closest("li")
    ).not.toHaveAttribute("aria-current");
    expect(
      screen.getByText("Buscando lugares para cada día").closest("li")
    ).toHaveAttribute("aria-current", "step");

    act(() => {
      vi.advanceTimersByTime(2200 * 3);
    });

    expect(
      screen.getByText("Optimizando tiempos y distancias").closest("li")
    ).toHaveAttribute("aria-current", "step");
  });

  it("adapta el detalle al estado de planificación", () => {
    render(<GeneracionItinerarioOverlay estado="EnPlanificacion" />);

    expect(
      screen.getByText(/Estamos generando las paradas/)
    ).toBeInTheDocument();
  });
});
