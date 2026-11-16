import { describe, expect, it } from "vitest";
import { getDayAndMonth, toDateOnlyString } from "./format";

describe("format", () => {
  it("formatea una fecha local como yyyy-MM-dd", () => {
    const fecha = new Date(2026, 2, 10);

    expect(toDateOnlyString(fecha)).toBe("2026-03-10");
  });

  it("formatea día y mes con dos dígitos", () => {
    const fecha = new Date(2026, 2, 5);

    expect(getDayAndMonth(fecha)).toBe("05/03");
  });
});
