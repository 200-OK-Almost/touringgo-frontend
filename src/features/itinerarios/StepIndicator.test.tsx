import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import StepIndicator from "./StepIndicator";

const STEPS = [
  { label: "Fechas y duración", shortLabel: "Fechas" },
  { label: "Barrio y punto de partida", shortLabel: "Barrio" },
  { label: "Compañía e intereses", shortLabel: "Intereses" },
  { label: "Estilo del viaje", shortLabel: "Estilo" },
];

describe("StepIndicator", () => {
  it("expone el progreso del wizard de forma accesible", () => {
    render(
      <StepIndicator
        currentStep={1}
        totalSteps={4}
        stepLabel="Barrio y punto de partida"
        steps={STEPS}
      />
    );

    const progressbar = screen.getByRole("progressbar", {
      name: "Progreso del planificador",
    });

    expect(progressbar).toHaveAttribute("aria-valuemin", "1");
    expect(progressbar).toHaveAttribute("aria-valuemax", "4");
    expect(progressbar).toHaveAttribute("aria-valuenow", "2");
    expect(progressbar).toHaveAttribute(
      "aria-valuetext",
      "Paso 2 de 4: Barrio y punto de partida"
    );
    expect(screen.getByText("Paso 2 de 4")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Barrio y punto de partida" })
    ).toBeInTheDocument();
  });

  it("permite volver a pasos completados", () => {
    const onStepSelect = vi.fn();

    render(
      <StepIndicator
        currentStep={2}
        totalSteps={4}
        stepLabel="Compañía e intereses"
        steps={STEPS}
        onStepSelect={onStepSelect}
      />
    );

    expect(
      screen.getByRole("navigation", { name: "Pasos del planificador" })
    ).toBeInTheDocument();

    const paso1 = screen.getByRole("button", {
      name: /Paso 1: Fechas y duración \(completado\)/,
    });
    const paso3 = screen.getByRole("button", {
      name: /Paso 3: Compañía e intereses/,
    });

    expect(paso1).toBeEnabled();
    expect(paso3).toHaveAttribute("aria-current", "step");
    expect(paso3).toBeDisabled();
    expect(
      screen.getByRole("button", { name: /Paso 4: Estilo del viaje/ })
    ).toBeDisabled();

    fireEvent.click(paso1);

    expect(onStepSelect).toHaveBeenCalledWith(0);
  });
});
