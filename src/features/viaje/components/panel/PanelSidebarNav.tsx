import {
  IoChatbubbleOutline,
  IoMapOutline,
  IoPeopleOutline,
  IoSettingsOutline,
  IoWalletOutline,
  IoSparkles,
} from "react-icons/io5";
import "./PanelSidebarNav.css";

export type PanelTab = "chat" | "miembros" | "gastos" | "ajustes" | "recorrido";

interface PanelSidebarNavProps {
  activeTab: PanelTab;
  onTabChange: (tab: PanelTab) => void;
  isMobile?: boolean;
  isChatOpen?: boolean;
  isRecorridoOpen?: boolean;
  onToggleRecorrido?: () => void;
}

export function PanelSidebarNav({
  activeTab,
  onTabChange,
  isMobile = false,
  isChatOpen = true,
  isRecorridoOpen = true,
  onToggleRecorrido,
}: PanelSidebarNavProps) {
  if (isMobile) {
    return (
      <nav className="panel-sidebar-nav panel-sidebar-nav--mobile" aria-label="Navegación de secciones">
        <button
          type="button"
          className={`panel-sidebar-nav__btn panel-sidebar-nav__btn--chat ${activeTab === "chat" ? "active" : ""}`}
          onClick={() => onTabChange("chat")}
          title="Chat con Turi"
          aria-label="Chat con Turi"
          aria-current={activeTab === "chat" ? "page" : undefined}
        >
          <span className="panel-sidebar-nav__chat-icon">
            <IoChatbubbleOutline className="panel-sidebar-nav__icon" />
            <IoSparkles
              className="panel-sidebar-nav__ai-sparkle panel-sidebar-nav__ai-sparkle--top"
              aria-hidden="true"
            />
            <IoSparkles
              className="panel-sidebar-nav__ai-sparkle panel-sidebar-nav__ai-sparkle--bottom"
              aria-hidden="true"
            />
          </span>
          <span className="panel-sidebar-nav__chat-label panel-sidebar-nav__label">Chat</span>
        </button>

        <button
          type="button"
          className={`panel-sidebar-nav__btn ${activeTab === "recorrido" ? "active" : ""}`}
          onClick={() => onTabChange("recorrido")}
          title="Itinerario y paradas"
          aria-label="Itinerario y paradas"
          aria-current={activeTab === "recorrido" ? "page" : undefined}
        >
          <IoMapOutline className="panel-sidebar-nav__icon" />
          <span className="panel-sidebar-nav__label">Recorrido</span>
        </button>

        <button
          type="button"
          className={`panel-sidebar-nav__btn ${activeTab === "miembros" ? "active" : ""}`}
          onClick={() => onTabChange("miembros")}
          title="Miembros del viaje"
          aria-label="Miembros del viaje"
          aria-current={activeTab === "miembros" ? "page" : undefined}
        >
          <IoPeopleOutline className="panel-sidebar-nav__icon" />
          <span className="panel-sidebar-nav__label">Miembros</span>
        </button>

        <button
          type="button"
          className={`panel-sidebar-nav__btn ${activeTab === "gastos" ? "active" : ""}`}
          onClick={() => onTabChange("gastos")}
          title="Gastos compartidos"
        >
          <IoWalletOutline className="panel-sidebar-nav__icon" />
          <span>Gastos</span>
        </button>

        <button
          type="button"
          className={`panel-sidebar-nav__btn ${activeTab === "ajustes" ? "active" : ""}`}
          onClick={() => onTabChange("ajustes")}
          title="Ajustes"
          aria-label="Ajustes"
          aria-current={activeTab === "ajustes" ? "page" : undefined}
        >
          <IoSettingsOutline className="panel-sidebar-nav__icon" />
          <span className="panel-sidebar-nav__label">Ajustes</span>
        </button>
      </nav>
    );
  }

  return (
    <nav className="panel-sidebar-nav panel-sidebar-nav--desktop" aria-label="Navegación de secciones">
      <div className="panel-sidebar-nav__top">
        <button
          type="button"
          className={`panel-sidebar-nav__btn panel-sidebar-nav__btn--chat ${activeTab === "chat" && isChatOpen ? "active" : ""}`}
          onClick={() => onTabChange("chat")}
          title={activeTab === "chat" && isChatOpen ? "Ocultar chat" : "Chat con Turi"}
          aria-label={activeTab === "chat" && isChatOpen ? "Ocultar chat" : "Chat con Turi"}
          aria-pressed={activeTab === "chat" && isChatOpen}
        >
          <span className="panel-sidebar-nav__chat-icon">
            <IoChatbubbleOutline className="panel-sidebar-nav__icon" />
            <IoSparkles
              className="panel-sidebar-nav__ai-sparkle panel-sidebar-nav__ai-sparkle--top"
              aria-hidden="true"
            />
            <IoSparkles
              className="panel-sidebar-nav__ai-sparkle panel-sidebar-nav__ai-sparkle--bottom"
              aria-hidden="true"
            />
          </span>
        </button>

        <button
          type="button"
          className={`panel-sidebar-nav__btn ${activeTab === "miembros" && isChatOpen ? "active" : ""}`}
          onClick={() => onTabChange("miembros")}
          title={activeTab === "miembros" && isChatOpen ? "Ocultar miembros" : "Miembros del viaje"}
          aria-label={activeTab === "miembros" && isChatOpen ? "Ocultar miembros" : "Miembros del viaje"}
          aria-pressed={activeTab === "miembros" && isChatOpen}
        >
          <IoPeopleOutline className="panel-sidebar-nav__icon" />
        </button>

        <button
          type="button"
          className={`panel-sidebar-nav__btn ${activeTab === "gastos" && isChatOpen ? "active" : ""}`}
          onClick={() => onTabChange("gastos")}
          title={activeTab === "gastos" && isChatOpen ? "Ocultar gastos" : "Gastos compartidos"}
        >
          <IoWalletOutline className="panel-sidebar-nav__icon" />
        </button>
      </div>

      <div className="panel-sidebar-nav__bottom">
        {onToggleRecorrido && (
          <button
            type="button"
            className={`panel-sidebar-nav__btn ${isRecorridoOpen ? "active-recorrido" : ""}`}
            onClick={onToggleRecorrido}
            title={isRecorridoOpen ? "Ocultar panel de recorrido" : "Mostrar panel de recorrido"}
            aria-label={isRecorridoOpen ? "Ocultar panel de recorrido" : "Mostrar panel de recorrido"}
            aria-pressed={isRecorridoOpen}
          >
            <IoMapOutline className="panel-sidebar-nav__icon" />
          </button>
        )}

        <button
          type="button"
          className={`panel-sidebar-nav__btn ${activeTab === "ajustes" && isChatOpen ? "active" : ""}`}
          onClick={() => onTabChange("ajustes")}
          title={activeTab === "ajustes" && isChatOpen ? "Ocultar ajustes" : "Ajustes del viaje"}
          aria-label={activeTab === "ajustes" && isChatOpen ? "Ocultar ajustes" : "Ajustes del viaje"}
          aria-pressed={activeTab === "ajustes" && isChatOpen}
        >
          <IoSettingsOutline className="panel-sidebar-nav__icon" />
        </button>
      </div>
    </nav>
  );
}

export default PanelSidebarNav;
