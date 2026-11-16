import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import type { ItinerarioViewModel } from "../types";
import "./ViajeMap.css"
import MapBounds from "./MapBounds";
import CustomMarker from "./CustomMarker";
interface ViajeMapProps {
    itinerarioViewModel: ItinerarioViewModel | null;
}

function ViajeMap({ itinerarioViewModel }: ViajeMapProps) {
    if (!itinerarioViewModel) {
      return (
        <div className="viaje-map-placeholder">
          <p>Generando itinerario...</p>
        </div>
    )}
  
    const paradas = itinerarioViewModel.paradas

    const centro: LatLngExpression = [-34.6037, -58.3816];
    
    const paradasPosiciones: LatLngExpression[] = paradas.map(parada => [
      parada.lugar.latitud,
      parada.lugar.longitud
    ]);
    let posiciones: LatLngExpression[] = paradasPosiciones

    if (itinerarioViewModel.itinerario.origenLatitud && itinerarioViewModel.itinerario.origenLongitud) {
      const origenPosicion: LatLngExpression = [
        itinerarioViewModel.itinerario.origenLatitud,
        itinerarioViewModel.itinerario.origenLongitud
      ]
      posiciones = [
        origenPosicion,
        ... posiciones
      ]
    }
    
    return (
      <div className="viaje-map-wrapper">
      <MapContainer
        center={centro}
        zoom={13}
        scrollWheelZoom={true}
        className="viaje-map-container"
      >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapBounds positions={posiciones} />
          
          {/* punto de partida */}
          {itinerarioViewModel.itinerario.origenLatitud != null &&
            itinerarioViewModel.itinerario.origenLongitud != null && (
              <Marker
                key={`origen-${itinerarioViewModel.itinerario.origenLatitud}-${itinerarioViewModel.itinerario.origenLongitud}`}
                position={[
                  Number(itinerarioViewModel.itinerario.origenLatitud),
                  Number(itinerarioViewModel.itinerario.origenLongitud),
                ]}
              >
                <Popup>
                  <strong>Punto de partida</strong>
                  <br />
                  {itinerarioViewModel.itinerario.origenDescripcion}
                </Popup>
              </Marker>
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
            color="#3388ff"
            weight={4}
          />
      </MapContainer>
      </div>
    );
}

export default ViajeMap;