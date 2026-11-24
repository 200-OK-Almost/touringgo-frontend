import { Fragment } from "react"
import type { LugarDetalleDto } from "../../../api/types"
import type { ParadaViewModel } from "../types"
import LugarRecorridoCard from "./LugarRecorridoCard"
import TramoRecorrido from "./TramoRecorrido"

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
    return <p>Este día todavía no tiene paradas.</p>

  return (
    <>
    {lugarPartida &&
      <LugarRecorridoCard
        key={lugarPartida.id}
        lugarPartida={lugarPartida}
      />
    }

    {paradasViewModel.map((parada, indice) => {
      const mostrarTramoInicial = indice === 0 && Boolean(lugarPartida);
      const mostrarTramo = mostrarTramoInicial || indice > 0;

      return (
        <Fragment key={parada.parada.id}>
          {mostrarTramo && (
            <TramoRecorrido
              distanciaMetros={parada.parada.distanciaMetrosDesdeAnterior}
              cuadras={parada.parada.cuadrasDesdeAnterior}
              minutosAPie={parada.parada.minutosAPieDesdeAnterior}
            />
          )}
          <LugarRecorridoCard
            paradaViewModel={parada}
            numero={indice + 1}
            puedeEditar={puedeEditar}
            onEliminar={onEliminarParada}
          />
        </Fragment>
      );
    })}
    </>
  )
}
export default DiaRecorrido