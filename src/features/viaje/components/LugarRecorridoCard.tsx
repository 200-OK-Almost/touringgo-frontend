import { PinIcon } from "../../../components/SelectablePlaceCard"
import SmartImage from "../../../components/SmartImage"
import type { ParadaViewModel } from "../types";
import "./LugarRecorridoCard.css"
import { IoCalendarOutline, IoTimeOutline } from "react-icons/io5";
import { getHourAndMinutes } from "../../../lib/format";

export interface LugarRecorridoCardProps {
  paradaViewModel: ParadaViewModel;
}

function LugarRecorridoCard({
  paradaViewModel,
} : LugarRecorridoCardProps) {
  return (
    <div className="lugar-recorrido-card">

      <div className="lugar-recorrido-card__body">
        <div className="lugar-recorrido-card__thumb">
          <SmartImage src={paradaViewModel.lugar.fotos[0].url} alt={paradaViewModel.lugar.nombre} />
        </div>

        <div className="lugar-recorrido-card__info">
          <h4 className="lugar-recorrido-card__nombre">{paradaViewModel.lugar.nombre}</h4>
          <p className="lugar-recorrido-card__direccion">
            <PinIcon />
            <span>{paradaViewModel.lugar.direccion}</span>
          </p>
          <p className="lugar-recorrido-card__tiempo">
            <IoCalendarOutline className="lugar-recorrido-card__icon"/>
            {getHourAndMinutes(paradaViewModel.parada.horaInicio)}
            <span>·</span>
            <IoTimeOutline className="lugar-recorrido-card__icon"/>
            {`${paradaViewModel.parada.duracionMinutos.toString()}m`} 
          </p>
        </div>
      </div>
    </div>

  )
}
export default LugarRecorridoCard