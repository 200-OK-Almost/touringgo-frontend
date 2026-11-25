import type { BarrioPorDia, DiaViaje } from "../../../lib/diasViaje";
import type { ItinerarioViewModel, ParadaViewModel } from "../../../types";
import type { LugarDetalleDto } from "../../../../../api/types";
import { formatearResumenDia, resumirDia } from "../../../lib/recorrido";
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
  barrioDiaActual?: BarrioPorDia;
  paradaSeleccionadaId?: string | null;
  onSeleccionarParada?: (paradaId: string, origen: "lista") => void;
  puedeEditar?: boolean;
  onEliminarParada?: (parada: ParadaViewModel) => Promise<void>;
}

export function RecorridoPanel({
  dias,
  diaSeleccionado,
  onDiaChange,
  itinerarioActual,
  lugarPartida,
  barrioDiaActual,
  paradaSeleccionadaId = null,
  onSeleccionarParada,
  puedeEditar = false,
  onEliminarParada,
}: RecorridoPanelProps) {
  const resumenDia = resumirDia(itinerarioActual?.paradas ?? null);
  const textoResumenDia = formatearResumenDia(resumenDia);

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
              paradaSeleccionadaId={paradaSeleccionadaId}
              onSeleccionarParada={
                onSeleccionarParada
                  ? (paradaId) => onSeleccionarParada(paradaId, "lista")
                  : undefined
              }
              puedeEditar={puedeEditar}
              onEliminarParada={onEliminarParada}
            />
          </div>
        </div>

        <div className="viaje-recorrido__footer">
          {textoResumenDia ? (
            <>
              <span className="viaje-recorrido__footer-label">
                Resumen del día
              </span>
              <p className="viaje-recorrido__footer-valor">
                {textoResumenDia}
              </p>
            </>
          ) : (
            <p className="viaje-recorrido__footer-vacio">
              Este día todavía no tiene paradas
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default RecorridoPanel;
