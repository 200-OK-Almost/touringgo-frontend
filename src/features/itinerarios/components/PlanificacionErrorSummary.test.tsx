import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PlanificacionErrorSummary } from "./PlanificacionErrorSummary";

describe("PlanificacionErrorSummary", () => {
  it("anuncia los errores en una región de alerta", () => {
    render(
      <PlanificacionErrorSummary
        errors={{ barrio: "Seleccioná un barrio." }}
      />
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Revisá estos campos")).toBeInTheDocument();
    expect(screen.getByText("Seleccioná un barrio.")).toBeInTheDocument();
  });

  it("lleva el foco al campo relacionado al elegir un error", () => {
    render(
      <>
        <h2 id="location-barrio-title" tabIndex={-1}>
          ¿Qué barrio querés recorrer?
        </h2>
        <PlanificacionErrorSummary
          errors={{ barrio: "Seleccioná un barrio." }}
        />
      </>
    );

    fireEvent.click(
      screen.getByRole("link", { name: "Seleccioná un barrio." })
    );

    expect(
      screen.getByRole("heading", { name: "¿Qué barrio querés recorrer?" })
    ).toHaveFocus();
  });

  it("no renderiza nada cuando no hay errores", () => {
    const { container } = render(<PlanificacionErrorSummary errors={{}} />);

    expect(container).toBeEmptyDOMElement();
  });
});
