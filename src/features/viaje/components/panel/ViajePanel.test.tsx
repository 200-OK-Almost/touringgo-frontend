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
});
