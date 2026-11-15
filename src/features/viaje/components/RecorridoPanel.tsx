import type { ParadaViewModel } from "../types"
import DiaRecorrido from "./DiaRecorrido"
import "./RecorridoPanel.css"

interface RecorridoPanelProps {
  paradas: ParadaViewModel[]
}

function RecorridoPanel({paradas}: RecorridoPanelProps) {

  return (
    <>
    <div className="recorrido-header">
      <h2>Recorrido</h2>
    </div>
    <div className="recorrido-dia">
      <DiaRecorrido
        paradasViewModel={paradas}
      />
    </div>
    </>
  )
}
export default RecorridoPanel