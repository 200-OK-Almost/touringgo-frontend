import type { BarrioPorDia, DiaViaje } from "../../../lib/diasViaje";
import type { ItinerarioViewModel } from "../../../types";
import type { LugarDetalleDto } from "../../../../../api/types";
import DiaSelector from "../../DiaSelector";
import DiaRecorrido from "../../DiaRecorrido";
import { barrioLabel, getDayAndMonth } from "../../../../../lib/format";
import "./RecorridoPanel.css";

interface RecorridoPanelProps {
  dias: DiaViaje[];
  diaSeleccionado: number;
  onDiaChange: (dia: number) => void;
  itinerarioActual: ItinerarioViewModel | null;
  lugarPartida: LugarDetalleDto | null;
  onClose?: () => void;
  barrioDiaActual: BarrioPorDia
}

export function RecorridoPanel({
  dias,
  diaSeleccionado,
  onDiaChange,
  itinerarioActual,
  lugarPartida,
  onClose,
  barrioDiaActual
}: RecorridoPanelProps) {
  const fechaStr = itinerarioActual?.itinerario.fecha
    ? getDayAndMonth(new Date(itinerarioActual.itinerario.fecha))
    : "";

  return (
    <section className="viaje-recorrido">
      <div className="viaje-recorrido__header">
        <div className="viaje-recorrido__header-row">
          <DiaSelector
            dias={dias}
            diaActual={diaSeleccionado}
            onDiaChange={onDiaChange}
          />

        </div>
      </div>

      <div className="viaje-recorrido__body">
        <div className="viaje-recorrido__group">
          <h3 className="viaje-recorrido__day-title">
            Día {itinerarioActual?.itinerario.numeroDia ?? diaSeleccionado}
            {fechaStr ? ` - ${fechaStr}` : ""}
            {` - ${barrioLabel(barrioDiaActual.barrio)}`}
          </h3>

          <div className="viaje-recorrido__paradas">
            <DiaRecorrido
              paradasViewModel={itinerarioActual?.paradas ?? null}
              lugarPartida={lugarPartida}
            />
          </div>
        </div>

        <div className="viaje-recorrido__footer">
          <p>
            {itinerarioActual?.paradas?.length
              ? `${itinerarioActual.paradas.length} paradas planificadas para este día`
              : "No hay paradas configuradas para este día"}
          </p>
        </div>
      </div>
    </section>
  );
}

export default RecorridoPanel;
