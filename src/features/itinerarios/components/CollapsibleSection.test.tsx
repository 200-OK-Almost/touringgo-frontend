import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CollapsibleSection from "./CollapsibleSection";

describe("CollapsibleSection", () => {
  it("muestra siempre el contenido sin botones de editar u ocultar", () => {
    render(
      <CollapsibleSection titleId="seccion" title="Sección">
        <p>Contenido de la sección</p>
      </CollapsibleSection>
    );

    expect(screen.getByText("Contenido de la sección")).toBeVisible();
    expect(
      screen.queryByRole("button", { name: "Ocultar" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Editar" })
    ).not.toBeInTheDocument();
  });

  it("muestra el resumen y el badge de completado", () => {
    render(
      <CollapsibleSection
        titleId="seccion"
        title="Sección"
        summary="Palermo"
        complete
      >
        <p>Contenido</p>
      </CollapsibleSection>
    );

    expect(screen.getByText("Palermo")).toBeInTheDocument();
    expect(screen.getByText("Completado")).toBeInTheDocument();
  });
});
