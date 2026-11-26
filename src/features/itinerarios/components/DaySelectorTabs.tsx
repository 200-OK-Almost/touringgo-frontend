import { useRef } from "react";
import type { KeyboardEvent } from "react";
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
  idPrefix?: string;
  panelId?: string;
}

const NAV_KEYS = ["ArrowLeft", "ArrowRight", "Home", "End"];

function DaySelectorTabs({
  dias,
  diaActivo,
  onChange,
  ariaLabel = "Días del viaje",
  isComplete = diaEstaCompleto,
  idPrefix = "day-tab",
  panelId,
}: DaySelectorTabsProps) {
  const listRef = useRef<HTMLDivElement>(null);

  if (dias.length === 0) {
    return null;
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!NAV_KEYS.includes(event.key)) {
      return;
    }

    const currentIndex = dias.findIndex((dia) => dia.dia === diaActivo);
    let nextIndex = currentIndex;

    switch (event.key) {
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = dias.length - 1;
        break;
      case "ArrowLeft":
        nextIndex = currentIndex <= 0 ? dias.length - 1 : currentIndex - 1;
        break;
      case "ArrowRight":
        nextIndex =
          currentIndex === -1 || currentIndex >= dias.length - 1
            ? 0
            : currentIndex + 1;
        break;
    }

    const nextDia = dias[nextIndex];

    if (!nextDia) {
      return;
    }

    event.preventDefault();
    onChange(nextDia.dia);

    const tabs = listRef.current?.querySelectorAll<HTMLButtonElement>(
      '[role="tab"]'
    );
    tabs?.[nextIndex]?.focus();
  };

  return (
    <div
      ref={listRef}
      className="day-tabs"
      role="tablist"
      aria-label={ariaLabel}
      aria-orientation="horizontal"
      onKeyDown={handleKeyDown}
    >
      {dias.map((dia) => {
        const activo = dia.dia === diaActivo;
        const completo = isComplete(dia);

        return (
          <button
            key={dia.dia}
            id={`${idPrefix}-${dia.dia}`}
            type="button"
            role="tab"
            aria-selected={activo}
            aria-controls={panelId}
            tabIndex={activo ? 0 : -1}
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
