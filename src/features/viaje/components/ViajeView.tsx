import { useState } from "react";
import type { ItinerarioViewModel, ViajeDto } from "../types";
import type { LugarDetalleDto } from "../../../api/types";
import ViajeMap from "./ViajeMap";
import { construirDiasViaje } from "../lib/diasViaje";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import ViajePanel from "./panel/ViajePanel";
import PanelSidebarNav, { type PanelTab } from "./panel/PanelSidebarNav";
import ChatTab from "./panel/tabs/ChatTab";
import MiembrosTab from "./panel/tabs/MiembrosTab";
import AjustesTab from "./panel/tabs/AjustesTab";
import RecorridoPanel from "./panel/recorrido/RecorridoPanel";
import "./ViajeView.css";

export interface ViajeViewProps {
  viaje: ViajeDto;
  itinerariosViewModel: ItinerarioViewModel[] | null;
  lugarPartida: LugarDetalleDto | null;
}

export function ViajeView({
  viaje,
  itinerariosViewModel,
  lugarPartida,
}: ViajeViewProps) {
  const [diaActual, setDiaActual] = useState(1);
  const [activeTab, setActiveTab] = useState<PanelTab>("chat");
  const [isRecorridoOpen, setIsRecorridoOpen] = useState(true);

  const isMobile = useMediaQuery("(max-width: 900px)");

  // En desktop, si la pestaña quedó en 'recorrido' (por venir de móvil), volvemos a 'chat'
  const currentTab = !isMobile && activeTab === "recorrido" ? "chat" : activeTab;

  const { dias } = construirDiasViaje(
    viaje.fechaInicio,
    viaje.fechaFin,
    viaje.itinerarios
  );

  const diaSeleccionado = dias.some((dia) => dia.numeroDia === diaActual)
    ? diaActual
    : dias[0]?.numeroDia ?? 1;

  const itinerarioActual =
    itinerariosViewModel?.find(
      (i) => i.itinerario.numeroDia === diaSeleccionado
    ) ?? null;

  // Calculamos el ancho ocupado por el panel para el offset del mapa en desktop
  const panelWidth = isMobile ? 0 : isRecorridoOpen ? 900 : 440;

  const toggleRecorridoPanel = () => setIsRecorridoOpen((prev) => !prev)

  // Renderizado del contenido primario según la pestaña activa
  const renderPrimaryContent = () => {
    if (isMobile && currentTab === "recorrido") {
      return (
        <RecorridoPanel
          dias={dias}
          diaSeleccionado={diaSeleccionado}
          onDiaChange={setDiaActual}
          itinerarioActual={itinerarioActual}
          lugarPartida={lugarPartida}
        />
      );
    }

    switch (currentTab) {
      case "miembros":
        return <MiembrosTab viaje={viaje} />;
      case "ajustes":
        return <AjustesTab viaje={viaje} />;
      case "chat":
      default:
        return <ChatTab viaje={viaje} />;
    }
  };

  return (
    <div className="viaje-layout">
      <section className="viaje-mapa">
        <ViajeMap
          itinerarioViewModel={itinerarioActual}
          panelWidth={panelWidth}
        />
      </section>

      <ViajePanel
        isMobile={isMobile}
        isRecorridoOpen={isRecorridoOpen}
        toggleRecorridoPanel={toggleRecorridoPanel}
        sidebarNav={
          <PanelSidebarNav
            activeTab={currentTab}
            onTabChange={setActiveTab}
            isMobile={isMobile}
            isRecorridoOpen={isRecorridoOpen}
            onToggleRecorrido={() => toggleRecorridoPanel()}
          />
        }
        primaryContent={renderPrimaryContent()}
        secondaryContent={
          <RecorridoPanel
            dias={dias}
            diaSeleccionado={diaSeleccionado}
            onDiaChange={setDiaActual}
            itinerarioActual={itinerarioActual}
            lugarPartida={lugarPartida}
            onClose={() => setIsRecorridoOpen(false)}
          />
        }
      />
    </div>
  );
}

export default ViajeView;
