import {
  IoChatbubblesOutline,
  IoMapOutline,
  IoPeopleOutline,
  IoSettingsOutline,
  IoWalletOutline,
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
          className={`panel-sidebar-nav__btn ${activeTab === "chat" ? "active" : ""}`}
          onClick={() => onTabChange("chat")}
          title="Chat con Turi"
        >
          <IoChatbubblesOutline className="panel-sidebar-nav__icon" />
          <span>Chat</span>
        </button>

        <button
          type="button"
          className={`panel-sidebar-nav__btn ${activeTab === "recorrido" ? "active" : ""}`}
          onClick={() => onTabChange("recorrido")}
          title="Itinerario y paradas"
        >
          <IoMapOutline className="panel-sidebar-nav__icon" />
          <span>Recorrido</span>
        </button>

        <button
          type="button"
          className={`panel-sidebar-nav__btn ${activeTab === "miembros" ? "active" : ""}`}
          onClick={() => onTabChange("miembros")}
          title="Miembros del viaje"
        >
          <IoPeopleOutline className="panel-sidebar-nav__icon" />
          <span>Miembros</span>
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
        >
          <IoSettingsOutline className="panel-sidebar-nav__icon" />
          <span>Ajustes</span>
        </button>
      </nav>
    );
  }

  return (
    <nav className="panel-sidebar-nav panel-sidebar-nav--desktop" aria-label="Navegación de secciones">
      <div className="panel-sidebar-nav__top">
        <button
          type="button"
          className={`panel-sidebar-nav__btn ${activeTab === "chat" && isChatOpen ? "active" : ""}`}
          onClick={() => onTabChange("chat")}
          title={activeTab === "chat" && isChatOpen ? "Ocultar chat" : "Chat con Turi"}
        >
          <IoChatbubblesOutline className="panel-sidebar-nav__icon" />
        </button>

        <button
          type="button"
          className={`panel-sidebar-nav__btn ${activeTab === "miembros" && isChatOpen ? "active" : ""}`}
          onClick={() => onTabChange("miembros")}
          title={activeTab === "miembros" && isChatOpen ? "Ocultar miembros" : "Miembros del viaje"}
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
          >
            <IoMapOutline className="panel-sidebar-nav__icon" />
          </button>
        )}

        <button
          type="button"
          className={`panel-sidebar-nav__btn ${activeTab === "ajustes" && isChatOpen ? "active" : ""}`}
          onClick={() => onTabChange("ajustes")}
          title={activeTab === "ajustes" && isChatOpen ? "Ocultar ajustes" : "Ajustes del viaje"}
        >
          <IoSettingsOutline className="panel-sidebar-nav__icon" />
        </button>
      </div>
    </nav>
  );
}

export default PanelSidebarNav;
