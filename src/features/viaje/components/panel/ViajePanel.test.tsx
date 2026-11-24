import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ViajePanel from "./ViajePanel";

describe("ViajePanel", () => {
  it("colapsa y expande el panel mobile", () => {
    const onToggleMobilePanel = vi.fn();

    const { rerender } = render(
      <ViajePanel
        isMobile
        isChatOpen
        isRecorridoOpen
        isMobilePanelExpanded={false}
        onToggleMobilePanel={onToggleMobilePanel}
        sidebarNav={<div>nav</div>}
        primaryContent={<div>contenido</div>}
      />
    );

    expect(screen.getByLabelText("Panel de viaje móvil")).toHaveClass(
      "viaje-panel--collapsed"
    );

    fireEvent.click(screen.getByRole("button", { name: "Expandir panel inferior" }));
    expect(onToggleMobilePanel).toHaveBeenCalledTimes(1);

    rerender(
      <ViajePanel
        isMobile
        isChatOpen
        isRecorridoOpen
        isMobilePanelExpanded
        onToggleMobilePanel={onToggleMobilePanel}
        sidebarNav={<div>nav</div>}
        primaryContent={<div>contenido</div>}
      />
    );

    expect(screen.getByLabelText("Panel de viaje móvil")).toHaveClass(
      "viaje-panel--expanded"
    );
    expect(screen.getByText("contenido")).toBeInTheDocument();
  });

  it("usa el estado colapsado por defecto", () => {
    render(
      <ViajePanel
        isMobile
        isChatOpen
        isRecorridoOpen
        sidebarNav={<div>nav</div>}
        primaryContent={<div>contenido</div>}
      />
    );

    expect(screen.getByLabelText("Panel de viaje móvil")).toHaveClass(
      "viaje-panel--collapsed"
    );
  });

  it("marca el panel secundario cerrado como inert", () => {
    const { rerender } = render(
      <ViajePanel
        isMobile={false}
        isChatOpen
        isRecorridoOpen={false}
        sidebarNav={<div>nav</div>}
        primaryContent={<div>contenido</div>}
        secondaryContent={<button type="button">Botón de recorrido</button>}
      />
    );

    const panel = screen.getByLabelText("Panel de control del viaje");
    const secundario = panel.querySelector(".viaje-panel__secondary-wrapper");
    expect(secundario).toHaveAttribute("aria-hidden", "true");
    expect(secundario).toHaveAttribute("inert");
    expect(screen.queryByRole("button", { name: "Botón de recorrido" })).toBeNull();

    rerender(
      <ViajePanel
        isMobile={false}
        isChatOpen
        isRecorridoOpen
        sidebarNav={<div>nav</div>}
        primaryContent={<div>contenido</div>}
        secondaryContent={<button type="button">Botón de recorrido</button>}
      />
    );

    const abierto = screen.getByLabelText("Panel de control del viaje");
    const wrapperAbierto = abierto.querySelector(".viaje-panel__secondary-wrapper");
    expect(wrapperAbierto).not.toHaveAttribute("aria-hidden", "true");
    expect(wrapperAbierto).not.toHaveAttribute("inert");
    expect(
      screen.getByRole("button", { name: "Botón de recorrido" })
    ).toBeInTheDocument();
  });
});
