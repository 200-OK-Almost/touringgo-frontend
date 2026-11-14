import { useState } from "react"
import { capitalize } from "../../../lib/format"
import type { ItinerarioViewModel, ViajeDto } from "../types"
import AsistentePanel from "./AsistentePanel"
import RecorridoPanel from "./RecorridoPanel"
import ViajeMap from "./ViajeMap"
import "./ViajeView.css"
import DiaRecorrido from "./DiaRecorrido"
import DiaSelector from "./DiaSelector"
export interface ViajeViewProps {
  viaje: ViajeDto
  itinerariosViewModel: ItinerarioViewModel[]
}

function getDaysBetween(inicio: Date, fin: Date) {
  const msPerDay = 1000 * 60 * 60 * 24;
  
  // Strip time and timezone offsets by converting to UTC midnight
  const utc1 = Date.UTC(inicio.getFullYear(), inicio.getMonth(), inicio.getDate());
  const utc2 = Date.UTC(fin.getFullYear(), fin.getMonth(), fin.getDate());

  return Math.floor(Math.abs(utc2 - utc1) / msPerDay);
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

  const dias = itinerariosViewModel.map(({itinerario}) => {
    return {
      numeroDia: itinerario.numeroDia,
      fecha: itinerario.fecha
    }
  })
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
          <div className="recorrido-header">
            <h2>Recorrido</h2>
            <DiaSelector 
              dias={dias}
              diaActual={diaActual}
              onDiaChange={setDiaActual}
            />
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
                paradasViewModel={itinerarioActual.paradas}
              />
            </div>
              {/* <RecorridoPanel 
                paradas={itinerarioActual.paradas}
              /> */}
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