import { PinIcon } from "../../../components/SelectablePlaceCard"
import SmartImage from "../../../components/SmartImage"
import type { ParadaViewModel } from "../types";
import "./LugarRecorridoCard.css"
import { IoCalendarOutline, IoTimeOutline } from "react-icons/io5";

export interface LugarRecorridoCardProps {
  paradaViewModel: ParadaViewModel;
}

function formatearHora(hora: string | null): string {
  if (!hora) return "—";

  const [horas, minutos] = hora.split(":");

  if (!horas || !minutos) return "—";

  return `${horas.padStart(2, "0")}:${minutos}`;
}

function formatearDuracion(duracion: number | null): string {
  return duracion == null ? "—" : `${duracion}m`;
}

function LugarRecorridoCard({
  paradaViewModel,
} : LugarRecorridoCardProps) {
  return (
    <div className="lugar-recorrido-card">

      <div className="lugar-recorrido-card__body">
        <div className="lugar-recorrido-card__thumb">
          <SmartImage src={paradaViewModel.lugar?.fotos?.[0]?.url} alt={paradaViewModel.lugar.nombre} />
        </div>

        <div className="lugar-recorrido-card__info">
          <h4 className="lugar-recorrido-card__nombre">{paradaViewModel.lugar.nombre}</h4>
          <p className="lugar-recorrido-card__direccion">
            <PinIcon />
            <span>{paradaViewModel.lugar.direccion}</span>
          </p>
          <p className="lugar-recorrido-card__tiempo">
            <IoCalendarOutline className="lugar-recorrido-card__icon"/>
            {formatearHora(paradaViewModel.parada.horaInicio)}
            <span>·</span>
            <IoTimeOutline className="lugar-recorrido-card__icon"/>
            {formatearDuracion(paradaViewModel.parada.duracionMinutos)}
          </p>
        </div>
      </div>
    </div>

  )
}
export default LugarRecorridoCard