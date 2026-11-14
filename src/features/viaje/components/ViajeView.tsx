import { capitalize } from "../../../lib/format"
import type { ViajeDto } from "../types"
import AsistentePanel from "./AsistentePanel"
import RecorridoPanel from "./RecorridoPanel"
import ViajeMap from "./ViajeMap"
import "./ViajeView.css"
export interface ViajeViewProps {
  viaje: ViajeDto
}

function ViajeView({viaje}: ViajeViewProps) {
  
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
              <ViajeMap viaje={viaje} />
          </section>
          {/* Itinerary */}
          <section className="viaje-recorrido">
              <RecorridoPanel viaje={viaje} />
          </section>
      </main>

      {/* Chat sidebar */}
      <aside className="viaje-sidebar">
          <AsistentePanel viaje={viaje} />
      </aside>

  </div>
  )
}
export default ViajeView