import React, { useState } from "react";
import "./ViajePanel.css";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

interface ViajePanelProps {
  isMobile: boolean;
  isRecorridoOpen: boolean;
  sidebarNav: React.ReactNode;
  primaryContent: React.ReactNode;
  secondaryContent?: React.ReactNode;
  toggleRecorridoPanel: () => void;
}

export function ViajePanel({
  isMobile,
  isRecorridoOpen,
  sidebarNav,
  primaryContent,
  secondaryContent,
  toggleRecorridoPanel
}: ViajePanelProps) {
  const [isMobileExpanded, setIsMobileExpanded] = useState(true);

  if (isMobile) {
    return (
      <aside
        className={`viaje-panel viaje-panel--mobile ${
          isMobileExpanded ? "viaje-panel--expanded" : "viaje-panel--collapsed"
        }`}
        aria-label="Panel de viaje móvil"
      >
        <button
          type="button"
          className="viaje-panel__handle-btn"
          onClick={() => setIsMobileExpanded((prev) => !prev)}
          aria-label={
            isMobileExpanded ? "Minimizar panel inferior" : "Expandir panel inferior"
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
      }`}
      aria-label="Panel de control del viaje"
    >
      <div className="viaje-panel__primary-card">
        {sidebarNav}
        <div className="viaje-panel__primary-body">{primaryContent}</div>

      <button
        type="button"
        className="viaje-recorrido__collapse-btn"
        onClick={toggleRecorridoPanel}
        title={isRecorridoOpen ? "Ocultar recorrido" : "Mostrar recorrido"}
        aria-label={isRecorridoOpen ? "Ocultar recorrido" : "Mostrar recorrido"}
      >
        {isRecorridoOpen ? <IoChevronBackOutline /> : <IoChevronForwardOutline />}
      </button>
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
