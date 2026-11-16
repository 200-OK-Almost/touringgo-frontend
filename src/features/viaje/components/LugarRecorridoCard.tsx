import { PinIcon } from "../../../components/SelectablePlaceCard"
import SmartImage from "../../../components/SmartImage"
import type { ParadaViewModel } from "../types";
import "./LugarRecorridoCard.css"
import { IoCalendarOutline, IoTimeOutline } from "react-icons/io5";
import type { LugarDetalleDto } from "../../../api/types";

export interface LugarRecorridoCardProps {
  paradaViewModel?: ParadaViewModel;
  lugarPartida?: LugarDetalleDto | null
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
  lugarPartida = null
} : LugarRecorridoCardProps) {
  
  const lugar = lugarPartida ? lugarPartida : paradaViewModel?.lugar

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
              {formatearHora(paradaViewModel.parada.horaInicio)}
              <span>·</span>
              <IoTimeOutline className="lugar-recorrido-card__icon"/>
              {formatearDuracion(paradaViewModel.parada.duracionMinutos)}
              </>
            }
          </p>
          {paradaViewModel &&
            <div className="place-card__chips">
            {lugar?.categorias && 
              lugar.categorias.map(x => 
                <span className="attr-chip attr-chip--categoria">{x.nombre}</span>
              )
            }
            {lugar?.aptoNinos && <span className="attr-chip attr-chip--ninos">Niños</span>}
            {lugar?.accesibleMovilidadReducida && (
              <span className="attr-chip attr-chip--accesible">Accesible</span>
            )}
            {lugar?.esBajoTecho && <span className="attr-chip attr-chip--bajotecho">Bajo techo</span>}
            </div>
          }
        </div>
      </div>
    </div>

  )
}
export default LugarRecorridoCard