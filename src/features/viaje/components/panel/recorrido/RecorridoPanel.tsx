import type { BarrioPorDia, DiaViaje } from "../../../lib/diasViaje";
import type { ItinerarioViewModel, ParadaViewModel } from "../../../types";
import type { LugarDetalleDto } from "../../../../../api/types";
import DiaSelector from "../../DiaSelector";
import DiaRecorrido from "../../DiaRecorrido";
import { barrioLabel } from "../../../../../lib/format";
import "./RecorridoPanel.css";

interface RecorridoPanelProps {
  dias: DiaViaje[];
  diaSeleccionado: number;
  onDiaChange: (dia: number) => void;
  itinerarioActual: ItinerarioViewModel | null;
  lugarPartida: LugarDetalleDto | null;
  barrioDiaActual?: BarrioPorDia
  puedeEditar?: boolean
  onEliminarParada?: (parada: ParadaViewModel) => Promise<void>
}

export function RecorridoPanel({
  dias,
  diaSeleccionado,
  onDiaChange,
  itinerarioActual,
  lugarPartida,
  barrioDiaActual,
  puedeEditar = false,
  onEliminarParada,
}: RecorridoPanelProps) {
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
            Día {diaSeleccionado}
            {barrioDiaActual ? ` - ${barrioLabel(barrioDiaActual.barrio)}` : ""}
          </h3>

          <div className="viaje-recorrido__paradas">
            <DiaRecorrido
              paradasViewModel={itinerarioActual?.paradas ?? null}
              lugarPartida={lugarPartida}
              puedeEditar={puedeEditar}
              onEliminarParada={onEliminarParada}
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
