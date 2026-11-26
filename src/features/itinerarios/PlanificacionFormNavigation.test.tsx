import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import PlanificacionFormNavigation from "./PlanificacionFormNavigation";

describe("PlanificacionFormNavigation", () => {
  it("muestra el estado de carga y bloquea la navegación al enviar", () => {
    const { container } = render(
      <PlanificacionFormNavigation
        onBack={vi.fn()}
        onNext={vi.fn()}
        isFirstStep={false}
        isLastStep
        isSubmitLoading
      />
    );

    expect(
      screen.getByRole("button", { name: /Generando/ })
    ).toBeDisabled();
    expect(screen.getByRole("button", { name: /Atrás/ })).toBeDisabled();
    expect(container.querySelector(".form-navigation-spinner")).not.toBeNull();
    expect(container.querySelector(".form-navigation")).toHaveAttribute(
      "aria-busy",
      "true"
    );
  });

  it("mantiene los botones habilitados cuando no está enviando", () => {
    render(
      <PlanificacionFormNavigation
        onBack={vi.fn()}
        onNext={vi.fn()}
        isFirstStep={false}
        isLastStep
        isSubmitLoading={false}
      />
    );

    expect(
      screen.getByRole("button", { name: /Armar itinerario con IA/ })
    ).toBeEnabled();
    expect(screen.getByRole("button", { name: /Atrás/ })).toBeEnabled();
  });
});
