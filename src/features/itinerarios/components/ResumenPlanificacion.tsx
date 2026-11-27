import { useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import type { ItineraryFormData } from "../planificacionFormData";
import type {
  DisponibilidadDiaria,
  ModalidadViaje,
  PuntoInicio,
  RitmoCaminata,
} from "../types";
import type { NivelPresupuesto } from "../../viaje/types";
import { formatearRangoFechas } from "../lib/fechas";
import { barrioLabel } from "../../../lib/format";
import "./ResumenPlanificacion.css";

const DISPONIBILIDAD_LABEL: Record<DisponibilidadDiaria, string> = {
  DiaCompleto: "Día completo",
  MananaAlmuerzo: "Mañana hasta el mediodía",
  TardeNoche: "Tarde hasta la noche",
};

const PUNTO_LABEL: Record<PuntoInicio, string> = {
  HospedajePropio: "Hospedaje propio",
  HospedajeSugerido: "Hospedaje sugerido",
  NodoUrbano: "Punto céntrico",
  PrimeraParada: "Primera parada",
};

const MODALIDAD_LABEL: Record<ModalidadViaje, string> = {
  Solo: "Solo",
  Amigos: "Con grupo",
  Pareja: "En pareja",
  Familia: "Con familia",
};

const RITMO_LABEL: Record<RitmoCaminata, string> = {
  Tranquilo: "Relajado",
  Moderado: "Moderado",
  Activo: "Activo",
};

const PRESUPUESTO_LABEL: Record<NivelPresupuesto, string> = {
  Economico: "Económico",
  Equilibrado: "Equilibrado",
  SinRestricciones: "Flexible",
};

export interface ResumenPlanificacionProps {
  formData: ItineraryFormData;
}

function unicos<T>(values: (T | null | undefined)[]): T[] {
  return Array.from(
    new Set(values.filter((value): value is T => value != null))
  );
}

function abiertoPorDefecto(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return true;
  }

  return window.matchMedia("(min-width: 1080px)").matches;
}

export function ResumenPlanificacion({ formData }: ResumenPlanificacionProps) {
  const [abierto, setAbierto] = useState(abiertoPorDefecto);

  const dias = formData.dias.length;
  const fechas = formData.fechaInicio
    ? formatearRangoFechas(formData.fechaInicio, formData.fechaFin)
    : "Sin definir";
  const disponibilidad = formData.disponibilidadDiaria
    ? DISPONIBILIDAD_LABEL[formData.disponibilidadDiaria]
    : "Sin definir";
  const barrios = unicos(formData.dias.map((dia) => dia.barrio)).map(barrioLabel);
  const puntos = unicos(formData.dias.map((dia) => dia.puntoInicio)).map(
    (punto) => PUNTO_LABEL[punto]
  );
  const modalidades = unicos(
    formData.dias.map((dia) => dia.modalidadViaje)
  ).map((modalidad) => MODALIDAD_LABEL[modalidad]);
  const intereses = Array.from(
    new Set(
      formData.dias.flatMap((dia) =>
        dia.categoriasPrioritarias.map((categoria) => categoria.nombre)
      )
    )
  );
  const estilo = [
    formData.dias[0]?.ritmoVisita
      ? RITMO_LABEL[formData.dias[0].ritmoVisita]
      : null,
    formData.dias[0]?.presupuestoNivel
      ? PRESUPUESTO_LABEL[formData.dias[0].presupuestoNivel]
      : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <details
      className="resumen-viaje"
      open={abierto}
      onToggle={(event) => setAbierto(event.currentTarget.open)}
    >
      <summary className="resumen-viaje__summary">
        <span className="resumen-viaje__heading">
          <span className="resumen-viaje__title">Resumen del viaje</span>
          <span className="resumen-viaje__meta">
            {dias > 0 ? `${dias} ${dias === 1 ? "día" : "días"}` : "Sin días"}
          </span>
        </span>
        <IoChevronDown className="resumen-viaje__chevron" aria-hidden="true" />
      </summary>

      <dl className="resumen-viaje__list">
        <div className="resumen-viaje__row">
          <dt>Fechas</dt>
          <dd>
            {fechas} · {disponibilidad}
          </dd>
        </div>
        <div className="resumen-viaje__row">
          <dt>Zonas</dt>
          <dd>{barrios.length > 0 ? barrios.join(", ") : "Sin definir"}</dd>
        </div>
        <div className="resumen-viaje__row">
          <dt>Punto de partida</dt>
          <dd>{puntos.length > 0 ? puntos.join(", ") : "Sin definir"}</dd>
        </div>
        <div className="resumen-viaje__row">
          <dt>Compañía</dt>
          <dd>
            {modalidades.length > 0 ? modalidades.join(", ") : "Sin definir"}
          </dd>
        </div>
        <div className="resumen-viaje__row">
          <dt>Intereses</dt>
          <dd>{intereses.length > 0 ? intereses.join(", ") : "Sin definir"}</dd>
        </div>
        <div className="resumen-viaje__row">
          <dt>Estilo</dt>
          <dd>{estilo || "Sin definir"}</dd>
        </div>
      </dl>

      <p className="resumen-viaje__hint">
        Revisá tus elecciones antes de generar el itinerario.
      </p>
    </details>
  );
}

export default ResumenPlanificacion;
