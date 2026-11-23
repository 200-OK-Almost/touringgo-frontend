import type { LugarDetalleDto } from "../../../api/types"
import type { ParadaViewModel } from "../types"
import LugarRecorridoCard from "./LugarRecorridoCard"

interface DiaRecorridoProps {
  paradasViewModel: ParadaViewModel[] | null
  lugarPartida: LugarDetalleDto | null
  puedeEditar?: boolean
  onEliminarParada?: (parada: ParadaViewModel) => Promise<void>
} 

function DiaRecorrido({
  paradasViewModel,
  lugarPartida,
  puedeEditar = false,
  onEliminarParada,
}: DiaRecorridoProps) {

  if (!paradasViewModel)
    return <p>No hay paradas para este día.</p>

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
        puedeEditar={puedeEditar}
        onEliminar={onEliminarParada}
      />
    )}
    </>
  )
}
export default DiaRecorrido