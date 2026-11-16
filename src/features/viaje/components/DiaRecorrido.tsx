import type { ParadaViewModel } from "../types"
import LugarRecorridoCard from "./LugarRecorridoCard"

interface DiaRecorridoProps {
  paradasViewModel: ParadaViewModel[] | null
} 

function DiaRecorrido({
  paradasViewModel
}: DiaRecorridoProps) {

  if (!paradasViewModel)
    return <p>No hay paradas para este día.</p>

  return (
    <>
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