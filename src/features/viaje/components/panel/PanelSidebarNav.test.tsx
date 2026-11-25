import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import PanelSidebarNav from "./PanelSidebarNav";

describe("PanelSidebarNav", () => {
  it("expone labels y estados en desktop", () => {
    render(
      <PanelSidebarNav
        activeTab="chat"
        onTabChange={vi.fn()}
        isChatOpen
        isRecorridoOpen
        onToggleRecorrido={vi.fn()}
      />
    );

    expect(
      screen.getByRole("button", { name: "Ocultar chat" })
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("button", { name: "Miembros del viaje" })
    ).toHaveAttribute("aria-pressed", "false");
    expect(
      screen.getByRole("button", { name: "Ocultar panel de recorrido" })
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("button", { name: "Ajustes del viaje" })
    ).toHaveAttribute("aria-pressed", "false");
  });

  it("marca la seccion activa en mobile", () => {
    render(
      <PanelSidebarNav
        activeTab="recorrido"
        onTabChange={vi.fn()}
        isMobile
      />
    );

    expect(
      screen.getByRole("button", { name: "Itinerario y paradas" })
    ).toHaveAttribute("aria-current", "page");
    expect(
      screen.getByRole("button", { name: "Chat con Turi" })
    ).not.toHaveAttribute("aria-current");
  });
});
