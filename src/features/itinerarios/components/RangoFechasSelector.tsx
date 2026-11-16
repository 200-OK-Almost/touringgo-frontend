import { useMemo, useState } from "react";
import { addDays, startOfDay } from "date-fns";
import { DayPicker, type DateRange, type Matcher } from "react-day-picker";
import { es } from "react-day-picker/locale/es";
import "react-day-picker/style.css";
import {
  duracionDiasInclusiva,
  formatearRangoFechas,
  MAX_DIAS_VIAJE,
  MENSAJE_RANGO_INVALIDO,
  parseFechaLocal,
} from "../lib/fechas";
import { toDateOnlyString } from "../../../lib/format";
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
  const [atajoPendiente, setAtajoPendiente] = useState<number | null>(null);

  const rango = useMemo<DateRange | undefined>(() => {
    const desde = parseFechaLocal(fechaInicio);

    if (!desde) {
      return undefined;
    }

    return {
      from: desde,
      to: parseFechaLocal(fechaFin) ?? undefined,
    };
  }, [fechaInicio, fechaFin]);

  const dias = duracionDiasInclusiva(fechaInicio, fechaFin);
  const errorRango =
    fechaInicio && fechaFin
      ? dias === null || dias < 1
        ? "La fecha de fin no puede ser anterior a la fecha de inicio."
        : dias > MAX_DIAS_VIAJE
          ? MENSAJE_RANGO_INVALIDO
          : null
      : null;

  const deshabilitados: Matcher[] = [{ before: hoy }];

  if (rango?.from && !rango.to) {
    deshabilitados.push({ after: addDays(rango.from, MAX_DIAS_VIAJE - 1) });
  }

  function handleSelect(next: DateRange | undefined) {
    if (!next?.from) {
      setAtajoPendiente(null);
      onChange({ fechaInicio: null, fechaFin: null });
      return;
    }

    if (atajoPendiente && !next.to) {
      const hasta = addDays(next.from, atajoPendiente - 1);
      setAtajoPendiente(null);
      onChange({
        fechaInicio: toDateOnlyString(next.from),
        fechaFin: toDateOnlyString(hasta),
      });
      return;
    }

    onChange({
      fechaInicio: toDateOnlyString(next.from),
      fechaFin: next.to ? toDateOnlyString(next.to) : null,
    });
  }

  function aplicarAtajo(cantidadDias: number) {
    const desde = parseFechaLocal(fechaInicio);

    if (!desde) {
      setAtajoPendiente(cantidadDias);
      return;
    }

    const hasta = addDays(desde, cantidadDias - 1);
    setAtajoPendiente(null);
    onChange({
      fechaInicio: toDateOnlyString(desde),
      fechaFin: toDateOnlyString(hasta),
    });
  }

  const mensajeError = errorRango ?? error;

  return (
    <div className="rango-fechas">
      <div className="rango-fechas__atajos" role="group" aria-label="Atajos de duración">
        {ATAJOS.map((cantidadDias) => (
          <button
            key={cantidadDias}
            type="button"
            className={`rango-fechas__atajo ${
              dias === cantidadDias ? "rango-fechas__atajo--activo" : ""
            }`}
            aria-pressed={dias === cantidadDias}
            onClick={() => aplicarAtajo(cantidadDias)}
          >
            {cantidadDias === 1 ? "1 día" : `${cantidadDias} días`}
          </button>
        ))}
      </div>

      {atajoPendiente && (
        <p className="rango-fechas__ayuda" role="status">
          Elegí la fecha de inicio para un viaje de{" "}
          {atajoPendiente === 1 ? "1 día" : `${atajoPendiente} días`}.
        </p>
      )}

      <div
        className="rango-fechas__calendario"
        role="group"
        aria-label="Calendario de fechas del viaje"
      >
        <DayPicker
          mode="range"
          locale={es}
          weekStartsOn={1}
          numberOfMonths={1}
          showOutsideDays
          startMonth={hoy}
          selected={rango}
          onSelect={handleSelect}
          disabled={deshabilitados}
          excludeDisabled
          className="rango-fechas__day-picker"
        />
      </div>

      <p className="rango-fechas__resumen" aria-live="polite">
        {formatearRangoFechas(fechaInicio, fechaFin)}
      </p>

      {mensajeError && (
        <p className="rango-fechas__error" role="alert">
          {mensajeError}
        </p>
      )}
    </div>
  );
}

export default RangoFechasSelector;
