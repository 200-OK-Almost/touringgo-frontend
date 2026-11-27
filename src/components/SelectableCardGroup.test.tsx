import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { SelectableCard } from "./SelectableCard";
import { SelectableCardGroup } from "./SelectableCardGroup";

function Harness() {
  const [selected, setSelected] = useState("a");

  return (
    <>
      <h2 id="group-title">Opciones</h2>
      <SelectableCardGroup role="radiogroup" labelledBy="group-title">
        {["a", "b", "c"].map((value) => (
          <SelectableCard
            key={value}
            title={value.toUpperCase()}
            selected={selected === value}
            onClick={() => setSelected(value)}
          />
        ))}
      </SelectableCardGroup>
    </>
  );
}

describe("SelectableCardGroup", () => {
  it("expone el rol de grupo y una sola opción en el orden de tabulación", () => {
    render(<Harness />);

    expect(
      screen.getByRole("radiogroup", { name: "Opciones" })
    ).toBeInTheDocument();

    const opciones = screen.getAllByRole("radio");
    expect(opciones[0]).toHaveAttribute("tabindex", "0");
    expect(opciones[1]).toHaveAttribute("tabindex", "-1");
    expect(opciones[2]).toHaveAttribute("tabindex", "-1");
  });

  it("navega con flechas y selecciona la opción enfocada", () => {
    render(<Harness />);

    const primera = screen.getByRole("radio", { name: "A" });
    primera.focus();
    fireEvent.keyDown(primera, { key: "ArrowRight" });

    const segunda = screen.getByRole("radio", { name: "B" });
    expect(segunda).toHaveFocus();
    expect(segunda).toHaveAttribute("aria-checked", "true");
    expect(primera).toHaveAttribute("aria-checked", "false");
  });
});
