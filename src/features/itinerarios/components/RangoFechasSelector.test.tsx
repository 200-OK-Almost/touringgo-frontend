import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { toDateOnlyString } from "../../../lib/format";
import {
  addDays,
  formatFullDate,
  formatShortDate,
  startOfDay,
} from "./date-range-widget/dateUtils";
import { RangoFechasSelector } from "./RangoFechasSelector";

describe("RangoFechasSelector", () => {
  it("convierte la selección del widget en strings YYYY-MM-DD", () => {
    const onChange = vi.fn();
    const hoy = startOfDay(new Date());

    render(
      <RangoFechasSelector
        fechaInicio={null}
        fechaFin={null}
        onChange={onChange}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: formatFullDate(hoy) }));

    expect(onChange).toHaveBeenCalledWith({
      fechaInicio: toDateOnlyString(hoy),
      fechaFin: toDateOnlyString(hoy),
    });
  });

  it("restaura la duración guardada en el draft", () => {
    const hoy = startOfDay(new Date());
    const fin = addDays(hoy, 2);

    render(
      <RangoFechasSelector
        fechaInicio={toDateOnlyString(hoy)}
        fechaFin={toDateOnlyString(fin)}
        onChange={() => {}}
      />
    );

    expect(screen.getByRole("button", { name: "3 días" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(
      screen.getByText(
        `Del ${formatShortDate(hoy)} al ${formatShortDate(fin)} · 3 días`
      )
    ).toBeInTheDocument();
  });

  it("muestra el error recibido", () => {
    render(
      <RangoFechasSelector
        fechaInicio={null}
        fechaFin={null}
        onChange={() => {}}
        error="Seleccioná la fecha de inicio."
      />
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Seleccioná la fecha de inicio."
    );
  });
});
