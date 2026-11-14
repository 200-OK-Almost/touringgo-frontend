import { useState } from "react"
import { capitalize } from "../../../lib/format"
import type { ItinerarioViewModel, ViajeDto } from "../types"
import AsistentePanel from "./AsistentePanel"
import RecorridoPanel from "./RecorridoPanel"
import ViajeMap from "./ViajeMap"
import "./ViajeView.css"
export interface ViajeViewProps {
  viaje: ViajeDto
  itinerariosViewModel: ItinerarioViewModel[]
}

function ViajeView({viaje, itinerariosViewModel}: ViajeViewProps) {
  const [diaActual, setDiaActual] = useState(1);
  const [paradaSeleccionadaId, setParadaSeleccionadaId] = useState<string | null>(null);

  const itinerarioActual = itinerariosViewModel.find(
      i => i.itinerario.numeroDia === diaActual
  );

  if (!itinerarioActual) {
      return <p>No hay itinerario disponible para este día.</p>;
  }

  return (
    <div className="viaje-layout">
      {/* Main content */}
      <main className="viaje-content">
          {/* Trip header */}
          <header className="viaje-header">
              <h1>Salida por {viaje.barrio}</h1>
              <p>
                  {capitalize(viaje.tipoViaje)}
                  <span>·</span>
                  {viaje.ritmoCaminata}
              </p>
          </header>
          {/* Map */}
          <section className="viaje-mapa">
              <ViajeMap
                itinerarioViewModel={itinerarioActual}
              />
          </section>
          {/* Itinerary */}
          <section className="viaje-recorrido">
              <RecorridoPanel 
                paradas={itinerarioActual.paradas}
              />
          </section>
      </main>

      {/* Chat sidebar */}
      <aside className="viaje-sidebar">
          <AsistentePanel 
            viaje={viaje} 
          />
      </aside>

  </div>
  )
}
export default ViajeView