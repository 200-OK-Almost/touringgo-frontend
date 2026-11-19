import type { DiaPlanificacion } from "../planificacionFormData";
import {
  diaEstaCompleto,
  formatearDiaPlanificacion,
} from "../lib/diasPlanificacion";
import "./DaySelectorTabs.css";

interface DaySelectorTabsProps {
  dias: DiaPlanificacion[];
  diaActivo: number;
  onChange: (numeroDia: number) => void;
  ariaLabel?: string;
  isComplete?: (dia: DiaPlanificacion) => boolean;
}

function DaySelectorTabs({
  dias,
  diaActivo,
  onChange,
  ariaLabel = "Días del viaje",
  isComplete = diaEstaCompleto,
}: DaySelectorTabsProps) {
  if (dias.length === 0) {
    return null;
  }

  return (
    <div className="day-tabs" role="tablist" aria-label={ariaLabel}>
      {dias.map((dia) => {
        const activo = dia.dia === diaActivo;
        const completo = isComplete(dia);

        return (
          <button
            key={dia.dia}
            type="button"
            role="tab"
            aria-selected={activo}
            className={`day-tab ${activo ? "day-tab--active" : ""} ${
              completo ? "day-tab--complete" : ""
            }`}
            onClick={() => onChange(dia.dia)}
          >
            <span className="day-tab__title">
              {formatearDiaPlanificacion(dia)}
            </span>
            <span className="day-tab__status">
              {completo ? "Completo" : "Falta completar"}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default DaySelectorTabs;
