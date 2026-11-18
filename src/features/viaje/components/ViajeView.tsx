import { useState } from "react"
import { barrioLabel, capitalize } from "../../../lib/format"
import type { ItinerarioViewModel, ViajeDto } from "../types"
import AsistentePanel from "./AsistentePanel"
import ViajeMap from "./ViajeMap"
import "./ViajeView.css"
import DiaRecorrido from "./DiaRecorrido"
import DiaSelector from "./DiaSelector"
import type { LugarDetalleDto } from "../../../api/types"
import { construirDiasViaje, obtenerBarriosPorDia } from "../lib/diasViaje"
import { TITULO_VIAJE_POR_DEFECTO } from "../lib/viajeTitulo"
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

  const titulo = viaje.titulo || TITULO_VIAJE_POR_DEFECTO;
  const barriosPorDia = obtenerBarriosPorDia(viaje.barrio, viaje.dias);
  const barrioDiaActual =
    barriosPorDia.find((dia) => dia.numeroDia === diaSeleccionado) ??
    barriosPorDia[0];

  return (
    <div className="viaje-layout">
      {/* Main content */}
      <main className="viaje-content">
          {/* Trip header */}
          <header className="viaje-header">
            <div className="viaje-header-info">
              <h1>{titulo}</h1>
              <p className="viaje-header-barrios">
                {barriosPorDia.length > 1
                  ? `Día ${barrioDiaActual.numeroDia} · `
                  : ""}
                Salida por {barrioLabel(barrioDiaActual.barrio)}
              </p>
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