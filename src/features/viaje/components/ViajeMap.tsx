import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import { useMemo } from "react";
import type { LatLngExpression } from "leaflet";
import type { ItinerarioViewModel } from "../types";
import "./ViajeMap.css"
import MapBounds from "./MapBounds";
import MapFocus from "./MapFocus";
import CustomMarker from "./CustomMarker";
import { CustomZoomControl } from "./CustomZoomControl";

const ROUTE_COLOR = "#059669";

interface ViajeMapProps {
  itinerarioViewModel: ItinerarioViewModel | null;
  panelWidth: number;
  isMobile?: boolean;
  isMobilePanelExpanded?: boolean;
  paradaSeleccionadaId?: string | null;
  paradaSeleccionadaOrigen?: "mapa" | "lista" | null;
  onSeleccionarParada?: (paradaId: string, origen: "mapa") => void;
}

function ViajeMap({
  itinerarioViewModel,
  panelWidth,
  isMobile = false,
  isMobilePanelExpanded = false,
  paradaSeleccionadaId = null,
  paradaSeleccionadaOrigen = null,
  onSeleccionarParada,
}: ViajeMapProps) {
    const posiciones = useMemo<LatLngExpression[]>(() => {
      if (!itinerarioViewModel) return [];

      const paradasPosiciones: LatLngExpression[] = itinerarioViewModel.paradas.map(parada => [
        parada.lugar.latitud,
        parada.lugar.longitud
      ]);

      const { origenLatitud, origenLongitud } = itinerarioViewModel.itinerario;

      if (origenLatitud != null && origenLongitud != null) {
        return [[origenLatitud, origenLongitud], ...paradasPosiciones];
      }

      return paradasPosiciones;
    }, [itinerarioViewModel]);

    const posicionSeleccionada = useMemo<LatLngExpression | null>(() => {
      if (!itinerarioViewModel || !paradaSeleccionadaId || paradaSeleccionadaOrigen !== "lista") return null;

      const parada = itinerarioViewModel.paradas.find(
        (parada) => parada.parada.id === paradaSeleccionadaId
      );
      if (!parada) return null;

      return [parada.lugar.latitud, parada.lugar.longitud];
    }, [itinerarioViewModel, paradaSeleccionadaId, paradaSeleccionadaOrigen]);

    if (!itinerarioViewModel) {
      return (
        <div className="viaje-map-placeholder">
          <p>Este día todavía no tiene itinerario.</p>
        </div>
    )}
  
    const paradas = itinerarioViewModel.paradas

    const centro: LatLngExpression = [-34.6037, -58.3816];
    
    return (
      <div className="viaje-map-wrapper">
      <MapContainer
        center={centro}
        zoom={13}
        scrollWheelZoom={true}
        className="viaje-map-container"
        zoomControl={false}
      >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapBounds
            panelWidth={panelWidth}
            positions={posiciones}
            isMobile={isMobile}
            isMobilePanelExpanded={isMobilePanelExpanded}
          />
          <MapFocus
            posicionSeleccionada={posicionSeleccionada}
          />
          
          {/* punto de partida */}
          {itinerarioViewModel.itinerario.origenLatitud != null &&
            itinerarioViewModel.itinerario.origenLongitud != null && (
              <CustomMarker
                key={`origen-${itinerarioViewModel.itinerario.origenLatitud}-${itinerarioViewModel.itinerario.origenLongitud}`}
                position={[
                  Number(itinerarioViewModel.itinerario.origenLatitud),
                  Number(itinerarioViewModel.itinerario.origenLongitud),
                ]}
                variant="origin"
              />
            )}
          {paradas.map((parada, index) => (
            <CustomMarker
              key={parada.parada.id}
              position={[
                  parada.lugar.latitud,
                  parada.lugar.longitud
              ]}
              number={index + 1}
              selected={parada.parada.id === paradaSeleccionadaId}
              onSelect={
                onSeleccionarParada
                  ? () => onSeleccionarParada(parada.parada.id, "mapa")
                  : undefined
              }
            />
          ))}

          <Polyline
            positions={posiciones}
            color={ROUTE_COLOR}
            weight={5}
            dashArray="2 8"
            lineCap="round"
          />
          <CustomZoomControl 
            position="bottomRight"
          />
      </MapContainer>
      </div>
    );
}

export default ViajeMap;
