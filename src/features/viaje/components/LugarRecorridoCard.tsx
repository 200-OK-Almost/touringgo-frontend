import { useEffect, useState } from "react";
import { PinIcon } from "../../../components/SelectablePlaceCard"
import SmartImage from "../../../components/SmartImage"
import type { ParadaItinerarioDto } from "../types";
import type { LugarDetalleDto, LugarResumenDto } from "../../../api/types";
import { getLugar } from "../../../api/lugares";
import "./LugarRecorridoCard.css"
import { IoCalendarClearOutline, IoCalendarOutline, IoTimeOutline } from "react-icons/io5";
import { getHourAndMinutes } from "../../../lib/format";

export interface LugarRecorridoCardProps {
  parada: ParadaItinerarioDto;
}

function LugarRecorridoCard({
  parada,
} : LugarRecorridoCardProps) {

  const [lugar, setLugar] = useState<LugarDetalleDto | null>(null)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const fetchLugar = async () => {
          try {
              const data = await getLugar(parada.lugarId)
              setLugar(data);
          } catch (error) {
              console.error(error);
          } finally {
              setLoading(false);
          }
      };

      fetchLugar();
  }, []);


  if (loading) return <p>Cargando lugar...</p>;
  if (!lugar) return <p>No se encontró el lugar.</p>;


  return (
    <div className="lugar-recorrido-card">

      <div className="lugar-recorrido-card__body">
        <div className="lugar-recorrido-card__thumb">
          <SmartImage src={lugar.fotos[0].url} alt={lugar.nombre} />
        </div>

        <div className="lugar-recorrido-card__info">
          <h4 className="lugar-recorrido-card__nombre">{lugar.nombre}</h4>
          <p className="lugar-recorrido-card__direccion">
            <PinIcon />
            <span>{lugar.direccion}</span>
          </p>
          <p className="lugar-recorrido-card__tiempo">
            <IoCalendarOutline className="lugar-recorrido-card__icon"/>
            {getHourAndMinutes(parada.horaInicio)}
            <span>·</span>
            <IoTimeOutline className="lugar-recorrido-card__icon"/>
            {`${parada.duracionMinutos.toString()}m`} 
          </p>
        </div>
      </div>
    </div>

  )
}
export default LugarRecorridoCard