import { describe, expect, it } from "vitest";
import { calcularAnchosPanel } from "./panelLayout";

describe("calcularAnchosPanel", () => {
  it("devuelve cero en mobile", () => {
    expect(
      calcularAnchosPanel({
        viewportWidth: 390,
        isMobile: true,
        isChatOpen: true,
        isRecorridoOpen: true,
      })
    ).toEqual({
      primaryWidth: 0,
      secondaryWidth: 0,
      panelWidth: 0,
    });
  });

  it("mantiene el chat colapsado en 54px", () => {
    const layout = calcularAnchosPanel({
      viewportWidth: 1440,
      isMobile: false,
      isChatOpen: false,
      isRecorridoOpen: true,
    });

    expect(layout.primaryWidth).toBe(54);
    expect(layout.secondaryWidth).toBe(420);
    expect(layout.panelWidth).toBe(450);
  });

  it("adapta los paneles al ancho disponible", () => {
    const layout = calcularAnchosPanel({
      viewportWidth: 1024,
      isMobile: false,
      isChatOpen: true,
      isRecorridoOpen: true,
    });

    expect(layout.primaryWidth).toBe(369);
    expect(layout.secondaryWidth).toBe(360);
    expect(layout.panelWidth).toBe(705);
  });

  it("mantiene el recorrido legible en desktop angosto", () => {
    const layout = calcularAnchosPanel({
      viewportWidth: 901,
      isMobile: false,
      isChatOpen: true,
      isRecorridoOpen: true,
    });

    expect(layout.primaryWidth).toBe(360);
    expect(layout.secondaryWidth).toBe(360);
    expect(layout.panelWidth).toBe(696);
  });

  it("respeta los anchos maximos en pantallas grandes", () => {
    const layout = calcularAnchosPanel({
      viewportWidth: 1440,
      isMobile: false,
      isChatOpen: true,
      isRecorridoOpen: true,
    });

    expect(layout.primaryWidth).toBe(480);
    expect(layout.secondaryWidth).toBe(420);
    expect(layout.panelWidth).toBe(876);
  });

  it("no reserva espacio del recorrido cuando esta cerrado", () => {
    const layout = calcularAnchosPanel({
      viewportWidth: 1440,
      isMobile: false,
      isChatOpen: true,
      isRecorridoOpen: false,
    });

    expect(layout.primaryWidth).toBe(480);
    expect(layout.secondaryWidth).toBe(420);
    expect(layout.panelWidth).toBe(480);
  });
});
