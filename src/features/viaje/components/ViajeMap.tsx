import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import { useMemo } from "react";
import type { LatLngExpression } from "leaflet";
import type { ItinerarioViewModel } from "../types";
import "./ViajeMap.css"
import MapBounds from "./MapBounds";
import CustomMarker from "./CustomMarker";
import { CustomZoomControl } from "./CustomZoomControl";

const ROUTE_COLOR = "#059669";

interface ViajeMapProps {
  itinerarioViewModel: ItinerarioViewModel | null;
  panelWidth: number
}

function ViajeMap({ itinerarioViewModel, panelWidth }: ViajeMapProps) {
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

    if (!itinerarioViewModel) {
      return (
        <div className="viaje-map-placeholder">
          <p>Generando itinerario...</p>
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
              >
                <strong>Punto de partida</strong>
                <br />
                {itinerarioViewModel.itinerario.origenDescripcion}
              </CustomMarker>
            )}
          {paradas.map((parada, index) => (
            <CustomMarker
              key={parada.lugar.id}
              position={[
                  parada.lugar.latitud,
                  parada.lugar.longitud
              ]}
              number={index + 1}
            >
              <strong>{index + 1}. {parada.lugar.nombre}</strong>
              <br />
              {parada.lugar.direccion}
            </CustomMarker>
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
