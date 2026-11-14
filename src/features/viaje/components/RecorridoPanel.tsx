import { useState } from "react"
import type { ViajeDto } from "../types"
import DiaRecorrido from "./DiaRecorrido"
import "./RecorridoPanel.css"

interface RecorridoPanelProps {
  viaje: ViajeDto
}

function RecorridoPanel({viaje}: RecorridoPanelProps) {
  const [diaActual, setDiaActual] = useState<number>(1)

  function getItinerarioActual() {
    return viaje.itinerarios.find(itinerario => itinerario.numeroDia == diaActual)
  }

  return (
    <>
    <div className="recorrido-header">
      <h2>Recorrido</h2>
    </div>
    <div className="recorrido-dia">
      <DiaRecorrido
        itinerario={getItinerarioActual() ?? null}
      />
    </div>
    </>
  )
}
export default RecorridoPanel