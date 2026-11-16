import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { DiaViaje } from "../lib/diasViaje";
import DiaSelector from "./DiaSelector";

function crearDias(cantidad: number): DiaViaje[] {
  return Array.from({ length: cantidad }, (_, indice) => ({
    numeroDia: indice + 1,
    fecha: `2026-03-${String(10 + indice).padStart(2, "0")}`,
    tieneItinerario: indice % 2 === 0,
  }));
}

describe("DiaSelector", () => {
  it("muestra una etiqueta y ningún botón para un viaje de 1 día", () => {
    render(
      <DiaSelector
        dias={crearDias(1)}
        diaActual={1}
        onDiaChange={() => undefined}
      />
    );

    expect(screen.getByText("1 día")).toBeInTheDocument();
    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  it("muestra cuatro botones con la fecha real para un viaje de 4 días", () => {
    render(
      <DiaSelector
        dias={crearDias(4)}
        diaActual={2}
        onDiaChange={() => undefined}
      />
    );

    expect(screen.getAllByRole("button")).toHaveLength(4);
    expect(
      screen.getByRole("button", { name: "Día 2 · mié 11/03" })
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("button", { name: "Día 4 · vie 13/03" })
    ).toHaveAttribute("aria-pressed", "false");
  });

  it("muestra siete botones para un viaje de 7 días", () => {
    render(
      <DiaSelector
        dias={crearDias(7)}
        diaActual={1}
        onDiaChange={() => undefined}
      />
    );

    expect(screen.getAllByRole("button")).toHaveLength(7);
  });

  it("avisa el día seleccionado al hacer clic", () => {
    const onDiaChange = vi.fn();

    render(
      <DiaSelector
        dias={crearDias(4)}
        diaActual={1}
        onDiaChange={onDiaChange}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Día 3 · jue 12/03" }));

    expect(onDiaChange).toHaveBeenCalledWith(3);
  });

  it("omite la fecha si el viaje legacy no la tiene", () => {
    render(
      <DiaSelector
        dias={[
          { numeroDia: 1, fecha: null, tieneItinerario: true },
          { numeroDia: 2, fecha: null, tieneItinerario: false },
        ]}
        diaActual={1}
        onDiaChange={() => undefined}
      />
    );

    const boton = screen.getByRole("button", { name: "Día 1" });
    expect(boton).toBeInTheDocument();
    expect(boton).not.toHaveTextContent("mar");
  });
});
