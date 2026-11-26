import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import StepIndicator from "./StepIndicator";

describe("StepIndicator", () => {
  it("expone el progreso del wizard de forma accesible", () => {
    render(
      <StepIndicator
        currentStep={1}
        totalSteps={4}
        stepLabel="Barrio y punto de partida"
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
});
