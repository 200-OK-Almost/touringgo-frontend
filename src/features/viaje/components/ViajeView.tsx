import { useState } from "react"
import { capitalize } from "../../../lib/format"
import type { ItinerarioViewModel, ViajeDto } from "../types"
import AsistentePanel from "./AsistentePanel"
import ViajeMap from "./ViajeMap"
import "./ViajeView.css"
import DiaRecorrido from "./DiaRecorrido"
import DiaSelector from "./DiaSelector"
import type { LugarDetalleDto } from "../../../api/types"
import { construirDiasViaje } from "../lib/diasViaje"
export interface ViajeViewProps {
  viaje: ViajeDto
  itinerariosViewModel: ItinerarioViewModel[] | null
  lugarPartida: LugarDetalleDto | null
}

function ViajeView({viaje, itinerariosViewModel, lugarPartida}: ViajeViewProps) {
  const [diaActual, setDiaActual] = useState(1);

  const { dias, warning } = construirDiasViaje(
    viaje.fechaInicio,
    viaje.fechaFin,
    viaje.itinerarios
  );

  const diaSeleccionado = dias.some((dia) => dia.numeroDia === diaActual)
    ? diaActual
    : dias[0]?.numeroDia ?? 1;

  const itinerarioActual = itinerariosViewModel?.find(
    i => i.itinerario.numeroDia === diaSeleccionado
  ) ?? null

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
              diaActual={diaSeleccionado}
              onDiaChange={setDiaActual}
            />
          </header>
          {warning && (
            <p className="viaje-dias-warning" role="status">
              {warning}
            </p>
          )}
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
                lugarPartida={lugarPartida}
              />
            </div>
          </section>
      </main>

      {/* Chat sidebar */}
      <aside className="viaje-sidebar">
          <AsistentePanel />
      </aside>

  </div>
  )
}
export default ViajeView