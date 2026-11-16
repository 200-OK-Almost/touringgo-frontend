import { useState } from "react"
import { capitalize } from "../../../lib/format"
import type { ItinerarioViewModel, ViajeDto } from "../types"
import AsistentePanel from "./AsistentePanel"
import ViajeMap from "./ViajeMap"
import "./ViajeView.css"
import DiaRecorrido from "./DiaRecorrido"
import DiaSelector from "./DiaSelector"
export interface ViajeViewProps {
  viaje: ViajeDto
  itinerariosViewModel: ItinerarioViewModel[] | null
}

function ViajeView({viaje, itinerariosViewModel}: ViajeViewProps) {
  const [diaActual, setDiaActual] = useState(1);
  const [paradaSeleccionadaId, setParadaSeleccionadaId] = useState<string | null>(null);

  const itinerarioActual = itinerariosViewModel?.find(
    i => i.itinerario.numeroDia === diaActual
  ) ?? null

  // if (!itinerarioActual) {
  //     return <p>No hay itinerario disponible para este día.</p>;
  // }

  const dias = itinerariosViewModel?.map(({itinerario}) => {
    return {
      numeroDia: itinerario.numeroDia,
      fecha: itinerario.fecha
    }
  }) ?? null

  return (
    <div className="viaje-layout">
      {/* Main content */}
      <main className="viaje-content">
          {/* Trip header */}
          <header className="viaje-header">
            <div className="viaje-header-info">
              <h1>Salida por {viaje.barrio}</h1>
              <p>
                {capitalize(viaje.tipoViaje)}
                <span>·</span>
                {viaje.ritmoCaminata}
              </p>
            </div>
            <DiaSelector 
              dias={dias}
              diaActual={diaActual}
              onDiaChange={setDiaActual}
            />
          </header>
          <div className="recorrido-header">
            <h2>Recorrido</h2>
          </div>
          <section className="viaje-mapa">
              <ViajeMap
                itinerarioViewModel={itinerarioActual}
              />
          </section>
          {/* Itinerary */}
          <section className="viaje-recorrido">
            <div className="recorrido-dia">
              <DiaRecorrido
                paradasViewModel={itinerarioActual?.paradas ?? null}
              />
            </div>
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