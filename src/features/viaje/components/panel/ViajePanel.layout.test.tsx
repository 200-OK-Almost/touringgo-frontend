import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ViajePanel from "./ViajePanel";

describe("ViajePanel layout", () => {
  it("aplica los anchos fluidos como variables CSS", () => {
    render(
      <ViajePanel
        isMobile={false}
        isChatOpen
        isRecorridoOpen
        primaryWidth={400}
        secondaryWidth={360}
        sidebarNav={<div>nav</div>}
        primaryContent={<div>contenido</div>}
        secondaryContent={<div>recorrido</div>}
      />
    );

    const panel = screen.getByLabelText("Panel de control del viaje");

    expect(panel.style.getPropertyValue("--panel-primary-width")).toBe(
      "400px"
    );
    expect(panel.style.getPropertyValue("--panel-secondary-width")).toBe(
      "360px"
    );
  });
});
