import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { DiaPlanificacion } from "../planificacionFormData";
import LocationStep from "./LocationStep";

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

describe("LocationStep", () => {
  it("con un solo día mantiene la UI simple, sin tabs ni atajo", () => {
    render(
      <LocationStep
        dias={[dia("2026-11-18", 1, "Palermo")]}
        onChangeDia={vi.fn()}
        errors={{}}
      />
    );

    expect(
      screen.getByRole("heading", { name: "¿Qué barrio querés recorrer?" })
    ).toBeInTheDocument();
    expect(screen.queryByRole("tab")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", {
        name: "Usar el mismo barrio para todos los días",
      })
    ).not.toBeInTheDocument();
  });

  it("con varios días muestra tabs y permite cambiar de día", () => {
    render(
      <LocationStep
        dias={[
          dia("2026-11-18", 1, "Palermo"),
          dia("2026-11-19", 2, "Recoleta"),
        ]}
        onChangeDia={vi.fn()}
        errors={{}}
      />
    );

    const tabDia1 = screen.getByRole("tab", { name: /Día 1/ });
    const tabDia2 = screen.getByRole("tab", { name: /Día 2/ });

    expect(tabDia1).toHaveAttribute("aria-selected", "true");
    expect(tabDia2).toHaveAttribute("aria-selected", "false");

    fireEvent.click(tabDia2);

    expect(tabDia2).toHaveAttribute("aria-selected", "true");
    expect(
      screen.getByRole("button", { name: "Recoleta" })
    ).toHaveClass("selectable-card-option--selected");
  });

  it("notifica el día correcto al elegir un barrio", () => {
    const onChangeDia = vi.fn();

    render(
      <LocationStep
        dias={[
          dia("2026-11-18", 1, "Palermo"),
          dia("2026-11-19", 2),
        ]}
        onChangeDia={onChangeDia}
        errors={{}}
      />
    );

    fireEvent.click(screen.getByRole("tab", { name: /Día 2/ }));
    fireEvent.click(screen.getByRole("button", { name: "San Telmo" }));

    expect(onChangeDia).toHaveBeenCalledWith(
      2,
      expect.objectContaining({ barrio: "SanTelmo" })
    );
  });

  it("copia el barrio del día 1 al resto con el atajo", () => {
    const onChangeDia = vi.fn();

    render(
      <LocationStep
        dias={[
          dia("2026-11-18", 1, "Palermo"),
          dia("2026-11-19", 2),
        ]}
        onChangeDia={onChangeDia}
        errors={{}}
      />
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Usar el mismo barrio para todos los días",
      })
    );

    expect(onChangeDia).toHaveBeenCalledWith(
      2,
      expect.objectContaining({ barrio: "Palermo" })
    );
  });

  it("muestra los días faltantes informados por validación", () => {
    render(
      <LocationStep
        dias={[
          dia("2026-11-18", 1, "Palermo"),
          dia("2026-11-19", 2),
        ]}
        onChangeDia={vi.fn()}
        errors={{ dias: "Faltan completar: Día 2." }}
      />
    );

    expect(
      screen.getByText("Faltan completar: Día 2.")
    ).toBeInTheDocument();
  });
});
