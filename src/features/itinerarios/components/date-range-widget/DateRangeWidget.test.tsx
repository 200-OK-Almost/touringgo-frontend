import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { DateRangeWidget } from "./DateRangeWidget";
import { formatFullDate, isSameDay } from "./dateUtils";

const MIN_DATE = new Date(2026, 10, 18);
const NOV_18 = new Date(2026, 10, 18);
const NOV_19 = new Date(2026, 10, 19);
const NOV_20 = new Date(2026, 10, 20);
const NOV_22 = new Date(2026, 10, 22);
const NOV_25 = new Date(2026, 10, 25);
const NOV_26 = new Date(2026, 10, 26);
const NOV_17 = new Date(2026, 10, 17);

interface HarnessProps {
  initialValue?: Date | null;
  initialDuration?: number;
  eventDates?: Date[];
  onAddReminder?: () => void;
  onNewEvent?: () => void;
  onChange?: (start: Date, end: Date) => void;
}

function Harness({
  initialValue = null,
  initialDuration,
  eventDates,
  onAddReminder,
  onNewEvent,
  onChange,
}: HarnessProps) {
  const [value, setValue] = useState<Date | null>(initialValue);

  return (
    <DateRangeWidget
      value={value}
      minDate={MIN_DATE}
      initialDuration={initialDuration}
      eventDates={eventDates}
      onAddReminder={onAddReminder}
      onNewEvent={onNewEvent}
      onChange={(start, end) => {
        setValue(start);
        onChange?.(start, end);
      }}
    />
  );
}

function dayButton(date: Date) {
  return screen.getByRole("button", { name: formatFullDate(date) });
}

describe("DateRangeWidget", () => {
  it("muestra el estado inicial y deshabilita los días pasados", () => {
    render(<Harness />);

    expect(screen.getByText("Elegí la fecha de inicio")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Noviembre" })
    ).toBeInTheDocument();
    expect(dayButton(NOV_18)).not.toBeDisabled();
    expect(dayButton(NOV_17)).toBeDisabled();
    expect(dayButton(NOV_17)).toHaveAttribute("aria-disabled", "true");
  });

  it("selecciona un día y calcula el rango con la duración activa", () => {
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);

    fireEvent.click(dayButton(NOV_18));

    expect(onChange).toHaveBeenCalledTimes(1);

    const [start, end] = onChange.mock.calls[0] as [Date, Date];

    expect(isSameDay(start, NOV_18)).toBe(true);
    expect(isSameDay(end, NOV_18)).toBe(true);
    expect(dayButton(NOV_18)).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("El 18/11 · 1 día")).toBeInTheDocument();
  });

  it("recalcula el rango al cambiar de chip", () => {
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);

    fireEvent.click(dayButton(NOV_18));
    fireEvent.click(screen.getByRole("button", { name: "3 días" }));

    const [start, end] = onChange.mock.calls.at(-1) as [Date, Date];

    expect(isSameDay(start, NOV_18)).toBe(true);
    expect(isSameDay(end, NOV_20)).toBe(true);
    expect(screen.getByRole("button", { name: "3 días" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(
      screen.getByText("Del 18/11 al 20/11 · 3 días")
    ).toBeInTheDocument();
    expect(dayButton(NOV_19)).toHaveClass("date-widget__day--in-range");
    expect(dayButton(NOV_20)).toHaveClass("date-widget__day--in-range");
  });

  it("usa la duración elegida si todavía no hay fecha de inicio", () => {
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: "5 días" }));

    expect(onChange).not.toHaveBeenCalled();

    fireEvent.click(dayButton(NOV_18));

    const [start, end] = onChange.mock.calls[0] as [Date, Date];

    expect(isSameDay(start, NOV_18)).toBe(true);
    expect(isSameDay(end, NOV_22)).toBe(true);
  });

  it("restaura la duración inicial del draft", () => {
    render(<Harness initialValue={NOV_18} initialDuration={5} />);

    expect(screen.getByRole("button", { name: "5 días" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(
      screen.getByText("Del 18/11 al 22/11 · 5 días")
    ).toBeInTheDocument();
  });

  it("cambia entre la vista semanal y la mensual", () => {
    render(<Harness />);

    expect(
      screen.getByRole("group", { name: "Días de la semana" })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Mensual" }));

    expect(
      screen.getByRole("group", { name: "Días del mes" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("group", { name: "Días de la semana" })
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Mensual" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );

    fireEvent.click(screen.getByRole("button", { name: "Semanal" }));

    expect(
      screen.getByRole("group", { name: "Días de la semana" })
    ).toBeInTheDocument();
  });

  it("no permite navegar a un mes anterior al actual", () => {
    render(<Harness />);

    fireEvent.click(screen.getByRole("button", { name: "Mensual" }));

    expect(
      screen.getByRole("button", { name: "Mes anterior" })
    ).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: "Mes siguiente" }));

    expect(
      screen.getByRole("button", { name: "Mes anterior" })
    ).not.toBeDisabled();
    expect(
      screen.getByRole("heading", { name: "Diciembre" })
    ).toBeInTheDocument();
  });

  it("marca los días que tienen eventos", () => {
    render(<Harness eventDates={[NOV_19]} />);

    expect(
      dayButton(NOV_19).querySelector(".date-widget__event-dot")
    ).not.toBeNull();
    expect(
      dayButton(NOV_18).querySelector(".date-widget__event-dot")
    ).toBeNull();
  });

  it("navega con las flechas del teclado", () => {
    render(<Harness initialValue={NOV_18} />);

    const selected = dayButton(NOV_18);
    selected.focus();
    expect(document.activeElement).toBe(selected);

    fireEvent.keyDown(selected, { key: "ArrowRight" });
    expect(document.activeElement).toBe(dayButton(NOV_19));

    fireEvent.keyDown(dayButton(NOV_19), { key: "ArrowDown" });
    expect(document.activeElement).toBe(dayButton(NOV_26));
  });

  it("cambia de semana con swipe horizontal", () => {
    const { container } = render(<Harness />);
    const calendar = container.querySelector(".date-widget__calendar");

    expect(calendar).not.toBeNull();

    fireEvent.pointerDown(calendar!, {
      clientX: 200,
      clientY: 100,
      pointerId: 1,
      pointerType: "touch",
    });
    fireEvent.pointerUp(calendar!, {
      clientX: 80,
      clientY: 100,
      pointerId: 1,
      pointerType: "touch",
    });

    expect(dayButton(NOV_25)).toBeInTheDocument();
  });

  it("dispara los callbacks del pie", () => {
    const onAddReminder = vi.fn();
    const onNewEvent = vi.fn();

    render(
      <Harness
        onAddReminder={onAddReminder}
        onNewEvent={onNewEvent}
      />
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Agregar recordatorio" })
    );
    fireEvent.click(screen.getByRole("button", { name: "+ Nuevo evento" }));

    expect(onAddReminder).toHaveBeenCalledTimes(1);
    expect(onNewEvent).toHaveBeenCalledTimes(1);
  });
});
