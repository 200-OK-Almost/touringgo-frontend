import type { LugarDetalleDto } from "../../../api/types"
import type { ParadaViewModel } from "../types"
import DiaRecorrido from "./DiaRecorrido"
import "./RecorridoPanel.css"

interface RecorridoPanelProps {
  paradas: ParadaViewModel[]
  lugarPartida?: LugarDetalleDto | null
}

function RecorridoPanel({paradas, lugarPartida = null}: RecorridoPanelProps) {

  return (
    <>
    <div className="recorrido-header">
      <h2>Recorrido</h2>
    </div>
    <div className="recorrido-dia">
      <DiaRecorrido
        paradasViewModel={paradas}
        lugarPartida={lugarPartida}
      />
    </div>
    </>
  )
}
export default RecorridoPanel