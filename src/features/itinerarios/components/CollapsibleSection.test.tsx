import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CollapsibleSection from "./CollapsibleSection";

describe("CollapsibleSection", () => {
  it("permite ocultar y volver a mostrar el contenido", () => {
    render(
      <CollapsibleSection titleId="seccion" title="Sección">
        <p>Contenido de la sección</p>
      </CollapsibleSection>
    );

    const toggle = screen.getByRole("button", { name: "Ocultar" });
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Contenido de la sección")).toBeVisible();

    fireEvent.click(toggle);

    const toggleCerrado = screen.getByRole("button", { name: "Editar" });
    expect(toggleCerrado).toHaveAttribute("aria-expanded", "false");
    expect(toggleCerrado).toHaveAttribute(
      "aria-controls",
      screen.getByText("Contenido de la sección").parentElement?.id
    );
    expect(
      screen.getByText("Contenido de la sección")
    ).not.toBeVisible();
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

  it("se mantiene abierta y sin toggle cuando forceOpen es true", () => {
    const { rerender } = render(
      <CollapsibleSection titleId="seccion" title="Sección" forceOpen={false}>
        <p>Contenido</p>
      </CollapsibleSection>
    );

    fireEvent.click(screen.getByRole("button", { name: "Ocultar" }));
    expect(screen.getByText("Contenido")).not.toBeVisible();

    rerender(
      <CollapsibleSection titleId="seccion" title="Sección" forceOpen>
        <p>Contenido</p>
      </CollapsibleSection>
    );

    expect(screen.getByText("Contenido")).toBeVisible();
    expect(
      screen.queryByRole("button", { name: "Ocultar" })
    ).not.toBeInTheDocument();
  });
});
