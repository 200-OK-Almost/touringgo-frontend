import { useMemo } from "react";
import {
  duracionDiasInclusiva,
  MAX_DIAS_VIAJE,
  MENSAJE_RANGO_INVALIDO,
  parseFechaLocal,
} from "../lib/fechas";
import { toDateOnlyString } from "../../../lib/format";
import { DateRangeWidget } from "./date-range-widget/DateRangeWidget";
import { startOfDay } from "./date-range-widget/dateUtils";
import "./RangoFechasSelector.css";

const ATAJOS = [1, 3, 5, 7];

export interface RangoFechasSelectorProps {
  fechaInicio: string | null;
  fechaFin: string | null;
  onChange: (changes: {
    fechaInicio: string | null;
    fechaFin: string | null;
  }) => void;
  error?: string;
}

export function RangoFechasSelector({
  fechaInicio,
  fechaFin,
  onChange,
  error,
}: RangoFechasSelectorProps) {
  const hoy = useMemo(() => startOfDay(new Date()), []);
  const fechaInicioDate = useMemo(
    () => parseFechaLocal(fechaInicio),
    [fechaInicio]
  );
  const dias = duracionDiasInclusiva(fechaInicio, fechaFin);
  const initialDuration =
    dias !== null && dias >= 1 && dias <= MAX_DIAS_VIAJE ? dias : undefined;

  const errorRango =
    fechaInicio && fechaFin
      ? dias === null || dias < 1
        ? "La fecha de fin no puede ser anterior a la fecha de inicio."
        : dias > MAX_DIAS_VIAJE
          ? MENSAJE_RANGO_INVALIDO
          : null
      : null;

  const mensajeError = errorRango ?? error;

  return (
    <div className="rango-fechas">
      <DateRangeWidget
        value={fechaInicioDate}
        minDate={hoy}
        durations={ATAJOS}
        initialDuration={initialDuration}
        onChange={(start, end) =>
          onChange({
            fechaInicio: toDateOnlyString(start),
            fechaFin: toDateOnlyString(end),
          })
        }
      />

      {mensajeError && (
        <p className="rango-fechas__error" role="alert">
          {mensajeError}
        </p>
      )}
    </div>
  );
}

export default RangoFechasSelector;
