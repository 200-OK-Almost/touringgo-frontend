import { Fragment } from "react"
import type { LugarDetalleDto } from "../../../api/types"
import type { ParadaViewModel } from "../types"
import { obtenerTramoDesdePunto } from "../lib/recorrido"
import LugarRecorridoCard from "./LugarRecorridoCard"
import TramoRecorrido from "./TramoRecorrido"

interface DiaRecorridoProps {
  paradasViewModel: ParadaViewModel[] | null;
  lugarPartida: LugarDetalleDto | null;
  paradaSeleccionadaId?: string | null;
  onSeleccionarParada?: (paradaId: string, origen: "lista") => void;
  puedeEditar?: boolean;
  onEliminarParada?: (parada: ParadaViewModel) => Promise<void>;
}

function DiaRecorrido({
  paradasViewModel,
  lugarPartida,
  paradaSeleccionadaId = null,
  onSeleccionarParada,
  puedeEditar = false,
  onEliminarParada,
}: DiaRecorridoProps) {

  if (!paradasViewModel)
    return <p>Este día todavía no tiene paradas.</p>

  const primeraParada = paradasViewModel[0] ?? null;
  const tramoDesdePartida = lugarPartida && primeraParada
    ? obtenerTramoDesdePunto(lugarPartida, primeraParada)
    : null;

  return (
    <>
    {lugarPartida &&
      <LugarRecorridoCard
        key={lugarPartida.id}
        lugarPartida={lugarPartida}
      />
    }

    {tramoDesdePartida && (
      <TramoRecorrido
        distanciaMetros={tramoDesdePartida.distanciaMetros}
        cuadras={tramoDesdePartida.cuadras}
        minutosAPie={tramoDesdePartida.minutosAPie}
      />
    )}

    {paradasViewModel.map((parada, indice) => {
      const siguiente = paradasViewModel[indice + 1] ?? null;
      const tramo = siguiente
        ? obtenerTramoDesdePunto(parada.lugar, siguiente)
        : null;

      return (
        <Fragment key={parada.parada.id}>
          <LugarRecorridoCard
            paradaViewModel={parada}
            numero={indice + 1}
            selected={parada.parada.id === paradaSeleccionadaId}
            onSeleccionar={
              onSeleccionarParada
                ? () => onSeleccionarParada(parada.parada.id, "lista")
                : undefined
            }
            puedeEditar={puedeEditar}
            onEliminar={onEliminarParada}
          />
          {tramo && (
            <TramoRecorrido
              distanciaMetros={tramo.distanciaMetros}
              cuadras={tramo.cuadras}
              minutosAPie={tramo.minutosAPie}
            />
          )}
        </Fragment>
      );
    })}
    </>
  )
}
export default DiaRecorrido