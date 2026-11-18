import { describe, expect, it } from "vitest";
import {
  addDays,
  countDaysInclusive,
  formatFullDate,
  formatMonthName,
  formatRangeSummary,
  formatShortDate,
  getMonthGrid,
  getWeekDays,
  isBeforeDay,
  isSameDay,
  startOfDay,
  startOfWeek,
  WEEKDAY_INITIALS,
} from "./dateUtils";

function expectDate(date: Date, year: number, month: number, day: number) {
  expect(date.getFullYear()).toBe(year);
  expect(date.getMonth()).toBe(month);
  expect(date.getDate()).toBe(day);
}

describe("startOfDay", () => {
  it("elimina la hora conservando la fecha local", () => {
    expectDate(startOfDay(new Date(2026, 10, 18, 23, 45)), 2026, 10, 18);
  });
});

describe("addDays", () => {
  it("suma días sin depender de la hora", () => {
    expectDate(addDays(new Date(2026, 10, 18, 23, 59), 3), 2026, 10, 21);
  });

  it("cruza fin de mes y fin de año", () => {
    expectDate(addDays(new Date(2026, 11, 31), 1), 2027, 0, 1);
    expectDate(addDays(new Date(2027, 0, 1), -1), 2026, 11, 31);
  });

  it("mantiene la medianoche local", () => {
    const date = addDays(new Date(2026, 2, 8), 1);

    expect(date.getHours()).toBe(0);
    expect(date.getMinutes()).toBe(0);
  });
});

describe("startOfWeek", () => {
  it("devuelve el lunes de la semana", () => {
    expectDate(startOfWeek(new Date(2026, 10, 18)), 2026, 10, 16);
  });

  it("trata al domingo como parte de la semana anterior", () => {
    expectDate(startOfWeek(new Date(2026, 10, 22)), 2026, 10, 16);
  });

  it("devuelve el mismo lunes", () => {
    expectDate(startOfWeek(new Date(2026, 10, 16)), 2026, 10, 16);
  });
});

describe("isSameDay e isBeforeDay", () => {
  it("compara solo el día e ignora la hora", () => {
    expect(
      isSameDay(
        new Date(2026, 10, 18, 23, 59),
        new Date(2026, 10, 18, 0, 0)
      )
    ).toBe(true);
    expect(
      isSameDay(new Date(2026, 10, 18), new Date(2026, 10, 19))
    ).toBe(false);
  });

  it("detecta días anteriores sin importar la hora", () => {
    expect(
      isBeforeDay(new Date(2026, 10, 17, 23, 59), new Date(2026, 10, 18, 0, 0))
    ).toBe(true);
    expect(
      isBeforeDay(new Date(2026, 10, 18, 0, 0), new Date(2026, 10, 18, 23, 59))
    ).toBe(false);
  });
});

describe("countDaysInclusive", () => {
  it("cuenta el día de inicio y el de fin", () => {
    expect(countDaysInclusive(new Date(2026, 10, 18), new Date(2026, 10, 18))).toBe(1);
    expect(countDaysInclusive(new Date(2026, 10, 18), new Date(2026, 10, 20))).toBe(3);
  });

  it("cruza meses", () => {
    expect(countDaysInclusive(new Date(2026, 10, 30), new Date(2026, 11, 2))).toBe(3);
  });
});

describe("getWeekDays", () => {
  it("devuelve siete días empezando el lunes", () => {
    const days = getWeekDays(new Date(2026, 10, 18));

    expect(days).toHaveLength(7);
    expectDate(days[0], 2026, 10, 16);
    expectDate(days[6], 2026, 10, 22);
  });
});

describe("getMonthGrid", () => {
  it("devuelve una grilla estable de seis semanas", () => {
    const grid = getMonthGrid(2026, 10);

    expect(grid).toHaveLength(42);
    expectDate(grid[0].date, 2026, 9, 26);
    expect(grid[0].inCurrentMonth).toBe(false);
    expectDate(grid[6].date, 2026, 10, 1);
    expect(grid[6].inCurrentMonth).toBe(true);
    expectDate(grid[41].date, 2026, 11, 6);
    expect(grid[41].inCurrentMonth).toBe(false);
  });

  it("incluye todos los días del mes actual", () => {
    const november = getMonthGrid(2026, 10).filter(
      (cell) => cell.inCurrentMonth
    );
    const february = getMonthGrid(2026, 1).filter(
      (cell) => cell.inCurrentMonth
    );

    expect(november).toHaveLength(30);
    expect(february).toHaveLength(28);
  });
});

describe("formatos en es-AR", () => {
  it("expone las iniciales de la semana", () => {
    expect(WEEKDAY_INITIALS).toEqual(["L", "M", "M", "J", "V", "S", "D"]);
  });

  it("formatea el nombre del mes con mayúscula inicial", () => {
    expect(formatMonthName(new Date(2026, 10, 18))).toBe("Noviembre");
    expect(formatMonthName(new Date(2026, 0, 1))).toBe("Enero");
  });

  it("formatea la fecha completa para el aria-label", () => {
    expect(formatFullDate(new Date(2026, 10, 18))).toBe(
      "miércoles 18 de noviembre de 2026"
    );
  });

  it("formatea una fecha corta", () => {
    expect(formatShortDate(new Date(2026, 2, 5))).toBe("05/03");
  });
});

describe("formatRangeSummary", () => {
  it("pide la fecha de inicio cuando no hay selección", () => {
    expect(formatRangeSummary(null, null)).toBe("Elegí la fecha de inicio");
  });

  it("resume un rango de un día", () => {
    expect(
      formatRangeSummary(new Date(2026, 10, 18), new Date(2026, 10, 18))
    ).toBe("El 18/11 · 1 día");
  });

  it("resume un rango de varios días", () => {
    expect(
      formatRangeSummary(new Date(2026, 10, 18), new Date(2026, 10, 20))
    ).toBe("Del 18/11 al 20/11 · 3 días");
  });

  it("avisa si el rango es inválido", () => {
    expect(
      formatRangeSummary(new Date(2026, 10, 18), new Date(2026, 10, 17))
    ).toBe("El rango de fechas no es válido");
  });
});
