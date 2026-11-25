import { useMediaQuery } from "../../../hooks/useMediaQuery";
import { useViewportWidth } from "../../../hooks/useViewportWidth";
import ViajePanel from "./panel/ViajePanel";
import PanelSidebarNav, { type PanelTab } from "./panel/PanelSidebarNav";
import ChatTab from "./panel/tabs/ChatTab";
import MiembrosTab from "./panel/tabs/MiembrosTab";
import AjustesTab from "./panel/tabs/AjustesTab";
import RecorridoPanel from "./panel/recorrido/RecorridoPanel";
import "./ViajeView.css";
import { useState } from "react"
import type { ItinerarioViewModel, ParadaViewModel, ReferenciaParada, ViajeDto } from "../types"
import ViajeMap from "./ViajeMap"
import type { LugarDetalleDto } from "../../../api/types"
import { construirDiasViaje, obtenerBarriosPorDia } from "../lib/diasViaje"
import { calcularAnchosPanel } from "../lib/panelLayout"
import { eliminarParada } from "../api/viajes"

export interface ViajeViewProps {
  viaje: ViajeDto;
  itinerariosViewModel: ItinerarioViewModel[] | null;
  lugarPartida: LugarDetalleDto | null;
  onItinerarioActualizado: () => Promise<void>;
}

export function ViajeView({
  viaje,
  itinerariosViewModel,
  lugarPartida,
  onItinerarioActualizado,
}: ViajeViewProps) {
  const [diaActual, setDiaActual] = useState(1);
  const [activeTab, setActiveTab] = useState<PanelTab>("chat");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isRecorridoOpen, setIsRecorridoOpen] = useState(true);
  const [referenciaParada, setReferenciaParada] = useState<ReferenciaParada | null>(null);
  const [paradaSeleccionadaId, setParadaSeleccionadaId] = useState<string | null>(null);
  const [paradaSeleccionadaOrigen, setParadaSeleccionadaOrigen] = useState<"mapa" | "lista" | null>(null);
  const [isMobilePanelExpanded, setIsMobilePanelExpanded] = useState(false);

  const isMobile = useMediaQuery("(max-width: 900px)");
  const viewportWidth = useViewportWidth();

  // En desktop, si la pestaña quedó en 'recorrido' (por venir de móvil), volvemos a 'chat'
  const currentTab = !isMobile && activeTab === "recorrido" ? "chat" : activeTab;

  const handleTabChange = (tab: PanelTab) => {
    if (isMobile) {
      setIsMobilePanelExpanded(true);
    }

    if (tab === "recorrido") {
      setActiveTab(tab);
      return;
    }

    // En desktop, clickear la pestaña activa colapsa/expande el contenido
    if (!isMobile && tab === activeTab) {
      setIsChatOpen((prev) => !prev);
      return;
    }

    setActiveTab(tab);
    setIsChatOpen(true);
  };

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

  const puedeEditar = viaje.puedeEditar === true
    && Boolean(itinerarioActual?.itinerario.version);

  const paradaSeleccionadaIdValida =
    paradaSeleccionadaId && itinerarioActual?.paradas.some(
      (parada) => parada.parada.id === paradaSeleccionadaId
    )
      ? paradaSeleccionadaId
      : null;

  const paradaSeleccionadaOrigenValida =
    paradaSeleccionadaIdValida ? paradaSeleccionadaOrigen : null;

  const handleEliminarParada = async (parada: ParadaViewModel) => {
    const version = itinerarioActual?.itinerario.version;

    if (!version || !itinerarioActual) {
      throw new Error("No se pudo determinar la versión del itinerario.");
    }

    await eliminarParada(
      viaje.id,
      itinerarioActual.itinerario.numeroDia,
      parada.parada.id,
      version
    );

    setReferenciaParada({
      lugarId: parada.lugar.id,
      nombre: parada.lugar.nombre,
      turno: parada.parada.turno,
      numeroDia: itinerarioActual.itinerario.numeroDia,
    });

    if (paradaSeleccionadaId === parada.parada.id) {
      setParadaSeleccionadaId(null);
      setParadaSeleccionadaOrigen(null);
    }

    await onItinerarioActualizado();
  };

  const handleDiaChange = (dia: number) => {
    setDiaActual(dia);
    setReferenciaParada(null);
    setParadaSeleccionadaId(null);
    setParadaSeleccionadaOrigen(null);
  };

  const handleSeleccionarParada = (
    paradaId: string,
    origen: "mapa" | "lista"
  ) => {
    setParadaSeleccionadaId(paradaId);
    setParadaSeleccionadaOrigen(origen);

    if (isMobile && origen === "lista") {
      setIsMobilePanelExpanded(false);
    }
  };

  const {
    primaryWidth,
    secondaryWidth,
    panelWidth,
  } = calcularAnchosPanel({
    viewportWidth,
    isMobile,
    isChatOpen,
    isRecorridoOpen,
  });

  const toggleRecorridoPanel = () => setIsRecorridoOpen((prev) => !prev)

  // Renderizado del contenido primario según la pestaña activa
  const renderPrimaryContent = () => {
    if (isMobile && currentTab === "recorrido") {
      return (
        <RecorridoPanel
          dias={dias}
          diaSeleccionado={diaSeleccionado}
          onDiaChange={handleDiaChange}
          itinerarioActual={itinerarioActual}
          lugarPartida={lugarPartida}
          barrioDiaActual={barrioDiaActual}
          paradaSeleccionadaId={paradaSeleccionadaIdValida}
          onSeleccionarParada={handleSeleccionarParada}
          puedeEditar={puedeEditar}
          onEliminarParada={handleEliminarParada}
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
        return (
          <ChatTab
            viaje={viaje}
            numeroDia={diaSeleccionado}
            itinerarioActual={itinerarioActual}
            referenciaParada={referenciaParada}
            onReferenciaUsada={() => setReferenciaParada(null)}
            onItinerarioActualizado={onItinerarioActualizado}
          />
        );
    }
  };

  const barriosPorDia = obtenerBarriosPorDia(viaje.barrio, viaje.dias);
  const barrioDiaActual =
    barriosPorDia.find((dia) => dia.numeroDia === diaSeleccionado) ??
    barriosPorDia[0];

  return (
    <div className="viaje-layout">
      <section className="viaje-mapa">
        <ViajeMap
          itinerarioViewModel={itinerarioActual}
          panelWidth={panelWidth}
          isMobile={isMobile}
          isMobilePanelExpanded={isMobilePanelExpanded}
          paradaSeleccionadaId={paradaSeleccionadaIdValida}
          paradaSeleccionadaOrigen={paradaSeleccionadaOrigenValida}
          onSeleccionarParada={handleSeleccionarParada}
        />
      </section>

      <ViajePanel
        isMobile={isMobile}
        isChatOpen={isChatOpen}
        isRecorridoOpen={isRecorridoOpen}
        primaryWidth={primaryWidth}
        secondaryWidth={secondaryWidth}
        isMobilePanelExpanded={isMobilePanelExpanded}
        onToggleMobilePanel={() => setIsMobilePanelExpanded(prev => !prev)}
        sidebarNav={
          <PanelSidebarNav
            activeTab={currentTab}
            onTabChange={handleTabChange}
            isMobile={isMobile}
            isChatOpen={isChatOpen}
            isRecorridoOpen={isRecorridoOpen}
            onToggleRecorrido={() => toggleRecorridoPanel()}
          />
        }
        primaryContent={renderPrimaryContent()}
        secondaryContent={
          <RecorridoPanel
            dias={dias}
            diaSeleccionado={diaSeleccionado}
            barrioDiaActual={barrioDiaActual}
            onDiaChange={handleDiaChange}
            itinerarioActual={itinerarioActual}
            lugarPartida={lugarPartida}
          paradaSeleccionadaId={paradaSeleccionadaIdValida}
          onSeleccionarParada={handleSeleccionarParada}
            puedeEditar={puedeEditar}
            onEliminarParada={handleEliminarParada}
          />
        }
      />
    </div>
  );
}

export default ViajeView;
