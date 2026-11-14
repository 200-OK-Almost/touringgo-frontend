import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import type { ItinerarioViewModel } from "../types";
import "./ViajeMap.css"
import MapBounds from "./MapBounds";
interface ViajeMapProps {
    itinerarioViewModel: ItinerarioViewModel;
}

function ViajeMap({ itinerarioViewModel }: ViajeMapProps) {
    const paradas = itinerarioViewModel.paradas

    const centro: LatLngExpression = [-34.6037, -58.3816];

    const origenPosicion: LatLngExpression = [
      itinerarioViewModel.itinerario.origenLatitud,
      itinerarioViewModel.itinerario.origenLongitud
    ]
    const paradasPosiciones: LatLngExpression[] = paradas.map(parada => [
      parada.lugar.latitud,
      parada.lugar.longitud
    ]);
    const posiciones: LatLngExpression[] = [
      origenPosicion,
      ... paradasPosiciones
    ]
    
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
          <Marker
            position={[itinerarioViewModel.itinerario.origenLatitud, itinerarioViewModel.itinerario.origenLongitud]}
          >
            <Popup>
              <strong>Punto de partida</strong>
              <br />
              {itinerarioViewModel.itinerario.origenDescripcion}
            </Popup>
          </Marker>

          {paradas.map((parada, index) => (
            <Marker
              key={parada.lugar.id}
              position={[parada.lugar.latitud, parada.lugar.longitud]}
            >
              <Popup>
                <strong>{index + 1}. {parada.lugar.nombre}</strong>
                <br />
                {parada.lugar.direccion}
              </Popup>
            </Marker>
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