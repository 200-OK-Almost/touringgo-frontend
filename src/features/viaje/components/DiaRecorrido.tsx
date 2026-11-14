import type { ItinerarioDto } from "../types"
import LugarRecorridoCard from "./LugarRecorridoCard"

interface DiaRecorridoProps {
  itinerario: ItinerarioDto | null
} 

function DiaRecorrido({
  itinerario
}: DiaRecorridoProps) {

  if (!itinerario)
    return <p>No se encontro el itinerario</p>

  return (
    <>
    {itinerario.paradas.map(parada => 
      <LugarRecorridoCard
        key={parada.id}
        parada={parada}
      />
    )}
    </>
  )
}
export default DiaRecorrido