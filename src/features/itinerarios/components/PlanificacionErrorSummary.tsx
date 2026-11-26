import { forwardRef } from "react";
import type { FormErrors } from "../PlanificationForm.validation";

type ErrorKey = keyof FormErrors;

const TARGET_IDS: Partial<Record<ErrorKey, string>> = {
  fechaInicio: "viaje-fechas",
  fechaFin: "viaje-fechas",
  disponibilidadDiaria: "duration-availability-title",
  dias: "planificacion-dias-error",
  barrio: "location-barrio-title",
  puntoInicio: "location-punto-title",
  hospedajeLugarGuid: "hospedaje-error",
  modalidadViaje: "preferences-modalidad-title",
  categoriasPrioritarias: "preferences-categorias-title",
  ritmoVisita: "style-ritmo-title",
  presupuestoNivel: "style-presupuesto-title",
  tipoTransporte: "style-ritmo-title",
};

export interface PlanificacionErrorSummaryProps {
  errors: FormErrors;
}

function focusTarget(targetId: string) {
  const target = document.getElementById(targetId);

  if (!target) {
    return;
  }

  target.scrollIntoView?.({ behavior: "smooth", block: "start" });
  target.focus({ preventScroll: true });
}

export const PlanificacionErrorSummary = forwardRef<
  HTMLDivElement,
  PlanificacionErrorSummaryProps
>(function PlanificacionErrorSummary({ errors }, ref) {
  const items = (Object.keys(errors) as ErrorKey[])
    .filter((key) => Boolean(errors[key]))
    .map((key) => ({
      key,
      message: errors[key] as string,
      targetId: TARGET_IDS[key],
    }));

  if (items.length === 0) {
    return null;
  }

  return (
    <div
      ref={ref}
      className="planificacion-error-summary"
      role="alert"
      aria-labelledby="planificacion-error-summary-title"
      tabIndex={-1}
    >
      <h2 id="planificacion-error-summary-title">Revisá estos campos</h2>
      <ul className="planificacion-error-summary__list">
        {items.map((item) => (
          <li key={item.key}>
            {item.targetId ? (
              <a
                href={`#${item.targetId}`}
                className="planificacion-error-summary__link"
                onClick={(event) => {
                  event.preventDefault();
                  focusTarget(item.targetId as string);
                }}
              >
                {item.message}
              </a>
            ) : (
              <span>{item.message}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
});

export default PlanificacionErrorSummary;
