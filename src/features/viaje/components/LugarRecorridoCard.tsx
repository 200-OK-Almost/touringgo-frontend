import { PinIcon } from "../../../components/SelectablePlaceCard"
import SmartImage from "../../../components/SmartImage"
import type { ParadaViewModel } from "../types";
import "./LugarRecorridoCard.css"
import { IoCalendarOutline, IoTimeOutline } from "react-icons/io5";
import { getHourAndMinutes } from "../../../lib/format";
import type { LugarDetalleDto } from "../../../api/types";

export interface LugarRecorridoCardProps {
  paradaViewModel?: ParadaViewModel;
  lugarPartida?: LugarDetalleDto | null
}


function LugarRecorridoCard({
  paradaViewModel,
  lugarPartida = null
} : LugarRecorridoCardProps) {
  
  const lugar = lugarPartida ? lugarPartida : paradaViewModel?.lugar

  const getHoraInicioParada = (paradaViewModel: ParadaViewModel) => {
    const [hours, minutes, seconds] = paradaViewModel.parada.horaInicio.split(':').map(Number);
    const horaInicio = new Date()
    horaInicio.setHours(hours, minutes, seconds)
    return getHourAndMinutes(horaInicio)
  }

  return (
    <div className="lugar-recorrido-card">

      <div className="lugar-recorrido-card__body">
        <div className="lugar-recorrido-card__thumb">
          <SmartImage src={lugar?.fotos?.[0]?.url} alt={lugar?.nombre ?? ""} />
        </div>

        <div className="lugar-recorrido-card__info">
          <h4 className="lugar-recorrido-card__nombre">
            {lugarPartida && "Punto de partida - "}{lugar?.nombre}
          </h4>
          <p className="lugar-recorrido-card__direccion">
            <PinIcon />
            <span>{lugar?.direccion}</span>
          </p>
          <p className="lugar-recorrido-card__tiempo">
            {paradaViewModel &&
              <>
              <IoCalendarOutline className="lugar-recorrido-card__icon"/>
              {getHoraInicioParada(paradaViewModel)}
              <span>·</span>
              <IoTimeOutline className="lugar-recorrido-card__icon"/>
              {`${paradaViewModel.parada.duracionMinutos.toString()}m`} 
              </>
            }
          </p>
        </div>
      </div>
    </div>

  )
}
export default LugarRecorridoCard