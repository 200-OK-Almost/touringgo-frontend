import { formatearFechaConDia } from "../../itinerarios/lib/fechas";
import type { DiaViaje } from "../lib/diasViaje";
import "./DiaSelector.css"

interface DiaSelectorProps {
  dias: DiaViaje[] | null;
  diaActual: number;
  onDiaChange: (dia: number) => void;
};

function DiaSelector({dias, diaActual, onDiaChange}: DiaSelectorProps) {
  if (!dias || dias.length === 0) {
    return null;
  }

  if (dias.length === 1) {
    return (
      <div className="dia-selector-container">
        <p className="dia-selector-label">DÍA</p>
        <span className="dia-selector__single">1 día</span>
      </div>
    );
  }

  return (
    <div className="dia-selector-container" aria-label="Días del viaje">
      <p className="dia-selector-label">
        DÍAS
      </p>
      <div className="dia-selector">
        {dias.map(dia => {
          const fecha = dia.fecha ? formatearFechaConDia(dia.fecha) : null;
          const tieneItinerario = dia.tieneItinerario;
          const etiqueta = `Día ${dia.numeroDia}${fecha ? ` · ${fecha}` : ""}${tieneItinerario ? "" : " · sin itinerario"}`;
          const activo = dia.numeroDia === diaActual;

          return (
            <button
              key={dia.numeroDia}
              type="button"
              className={`dia-selector__item ${activo ? "active" : ""} ${tieneItinerario ? "" : "dia-selector__item--sin-itinerario"}`}
              aria-label={etiqueta}
              aria-pressed={activo}
              title={etiqueta}
              onClick={() => onDiaChange(dia.numeroDia)}
            >
              <span className="dia-selector__numero">
                {dia.numeroDia}
              </span>

              {fecha && (
                <span className="dia-selector__fecha">
                  {fecha}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  )
}
export default DiaSelector
