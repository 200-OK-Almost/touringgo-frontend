import type { LugarDetalleDto } from "../../../api/types"
import type { ParadaViewModel } from "../types"
import LugarRecorridoCard from "./LugarRecorridoCard"

interface DiaRecorridoProps {
  paradasViewModel: ParadaViewModel[] | null
  lugarPartida: LugarDetalleDto | null
} 

function DiaRecorrido({
  paradasViewModel,
  lugarPartida
}: DiaRecorridoProps) {

  if (!paradasViewModel)
    return <p>No se encontro el itinerario</p>

  return (
    <>
    {lugarPartida &&
      <LugarRecorridoCard
        key={lugarPartida.id}
        lugarPartida={lugarPartida}
      />
    }

    {paradasViewModel.map(parada => 
      <LugarRecorridoCard
        key={parada.parada.id}
        paradaViewModel={parada}
      />
    )}
    </>
  )
}
export default DiaRecorrido