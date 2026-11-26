import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { DiaPlanificacion } from "../planificacionFormData";
import DaySelectorTabs from "./DaySelectorTabs";

function dia(numero: number, fecha: string): DiaPlanificacion {
  return {
    fecha,
    dia: numero,
    barrio: null,
    puntoInicio: null,
    hospedajeLugarGuid: null,
    hospedajeBarrio: null,
    modalidadViaje: null,
    categoriasPrioritarias: [],
  };
}

const DIAS = [dia(1, "2026-11-18"), dia(2, "2026-11-19")];

describe("DaySelectorTabs", () => {
  it("expone los tabs con roving tabindex y aria-controls", () => {
    render(
      <DaySelectorTabs
        dias={DIAS}
        diaActivo={1}
        onChange={vi.fn()}
        idPrefix="test-day"
        panelId="test-panel"
      />
    );

    const tabDia1 = screen.getByRole("tab", { name: /Día 1/ });
    const tabDia2 = screen.getByRole("tab", { name: /Día 2/ });

    expect(tabDia1).toHaveAttribute("id", "test-day-1");
    expect(tabDia1).toHaveAttribute("aria-controls", "test-panel");
    expect(tabDia1).toHaveAttribute("aria-selected", "true");
    expect(tabDia1).toHaveAttribute("tabindex", "0");
    expect(tabDia2).toHaveAttribute("tabindex", "-1");
  });

  it("navega entre días con las flechas y mueve el foco", () => {
    const onChange = vi.fn();

    render(
      <DaySelectorTabs dias={DIAS} diaActivo={1} onChange={onChange} />
    );

    const tabDia1 = screen.getByRole("tab", { name: /Día 1/ });
    tabDia1.focus();
    fireEvent.keyDown(tabDia1, { key: "ArrowRight" });

    expect(onChange).toHaveBeenCalledWith(2);
    expect(screen.getByRole("tab", { name: /Día 2/ })).toHaveFocus();
  });

  it("salta al último día con End", () => {
    const onChange = vi.fn();

    render(
      <DaySelectorTabs dias={DIAS} diaActivo={1} onChange={onChange} />
    );

    fireEvent.keyDown(screen.getByRole("tab", { name: /Día 1/ }), {
      key: "End",
    });

    expect(onChange).toHaveBeenCalledWith(2);
  });
});
