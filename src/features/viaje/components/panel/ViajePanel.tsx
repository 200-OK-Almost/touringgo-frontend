import React from "react";
import "./ViajePanel.css";

interface ViajePanelProps {
  isMobile: boolean;
  isChatOpen: boolean;
  isRecorridoOpen: boolean;
  isMobilePanelExpanded?: boolean;
  onToggleMobilePanel?: () => void;
  sidebarNav: React.ReactNode;
  primaryContent: React.ReactNode;
  secondaryContent?: React.ReactNode;
}

export function ViajePanel({
  isMobile,
  isChatOpen,
  isRecorridoOpen,
  isMobilePanelExpanded = false,
  onToggleMobilePanel,
  sidebarNav,
  primaryContent,
  secondaryContent,
}: ViajePanelProps) {
  if (isMobile) {
    return (
      <aside
        className={`viaje-panel viaje-panel--mobile ${
          isMobilePanelExpanded ? "viaje-panel--expanded" : "viaje-panel--collapsed"
        }`}
        aria-label="Panel de viaje móvil"
      >
        <button
          type="button"
          className="viaje-panel__handle-btn"
          onClick={() => onToggleMobilePanel?.()}
          aria-label={
            isMobilePanelExpanded ? "Minimizar panel inferior" : "Expandir panel inferior"
          }
        >
          <div className="viaje-panel__handle-bar" />
        </button>

        <div className="viaje-panel__mobile-nav">{sidebarNav}</div>

        <div className="viaje-panel__mobile-body">{primaryContent}</div>
      </aside>
    );
  }

  return (
    <aside
      className={`viaje-panel viaje-panel--desktop ${
        isRecorridoOpen ? "with-recorrido" : "without-recorrido"
      } ${isChatOpen ? "" : "chat-collapsed"}`}
      aria-label="Panel de control del viaje"
    >
      <div className="viaje-panel__primary-card">
        {sidebarNav}
        <div className="viaje-panel__primary-body">{primaryContent}</div>
      </div>

      {secondaryContent && (
        <div className="viaje-panel__secondary-wrapper" aria-hidden={!isRecorridoOpen}>
          {secondaryContent}
        </div>
      )}
    </aside>
  );
}

export default ViajePanel;
