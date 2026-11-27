import { useEffect, useMemo, useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import type { LugarDetalleDto } from "../../../api/types";
import { getLugaresDetalle } from "../../../api/lugares";
import type {
  DiaPlanificacion,
  ItineraryFormData,
} from "../planificacionFormData";
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

const PENDIENTE = "Pendiente";

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

function clasePendiente(texto: string) {
  return texto === PENDIENTE ? "resumen-viaje__valor--pendiente" : undefined;
}

function textoBarrio(dia: DiaPlanificacion): string {
  return dia.barrio ? barrioLabel(dia.barrio) : PENDIENTE;
}

function textoPuntoPartida(
  dia: DiaPlanificacion,
  lugaresPartida: Record<string, LugarDetalleDto>
): string {
  if (!dia.puntoInicio) {
    return PENDIENTE;
  }

  if (
    (dia.puntoInicio === "HospedajePropio" ||
      dia.puntoInicio === "HospedajeSugerido") &&
    dia.hospedajeLugarGuid
  ) {
    const lugar = lugaresPartida[dia.hospedajeLugarGuid];

    if (lugar) {
      return lugar.nombre;
    }
  }

  return PUNTO_LABEL[dia.puntoInicio];
}

interface LineaDiaProps {
  dia: DiaPlanificacion;
  lugaresPartida: Record<string, LugarDetalleDto>;
}

function LineaDia({ dia, lugaresPartida }: LineaDiaProps) {
  const barrio = textoBarrio(dia);
  const punto = textoPuntoPartida(dia, lugaresPartida);

  return (
    <dd className="resumen-viaje__dia-linea">
      Día {dia.dia} · <span className={clasePendiente(barrio)}>{barrio}</span> —{" "}
      <span className={clasePendiente(punto)}>{punto}</span>
    </dd>
  );
}

export function ResumenPlanificacion({ formData }: ResumenPlanificacionProps) {
  const [abierto, setAbierto] = useState(abiertoPorDefecto);
  const [lugaresPartida, setLugaresPartida] = useState<
    Record<string, LugarDetalleDto>
  >({});

  const guidsPartida = useMemo(
    () =>
      Array.from(
        new Set(
          formData.dias.flatMap((dia) =>
            dia.hospedajeLugarGuid ? [dia.hospedajeLugarGuid] : []
          )
        )
      ),
    [formData.dias]
  );
  const guidsKey = guidsPartida.join("|");

  useEffect(() => {
    if (!guidsKey) {
      return;
    }

    let cancelado = false;

    getLugaresDetalle(guidsKey.split("|"))
      .then((lugares) => {
        if (cancelado) {
          return;
        }

        setLugaresPartida((prev) => {
          const siguiente = { ...prev };
          lugares.forEach((lugar) => {
            siguiente[lugar.id] = lugar;
          });
          return siguiente;
        });
      })
      .catch(() => {
        // Sin detalle del hospedaje, se muestra la etiqueta del tipo de punto
      });

    return () => {
      cancelado = true;
    };
  }, [guidsKey]);

  const dias = formData.dias.length;
  const esUnDia = formData.dias.length === 1;
  const fechas = formData.fechaInicio
    ? formatearRangoFechas(formData.fechaInicio, formData.fechaFin)
    : PENDIENTE;
  const momento = formData.disponibilidadDiaria
    ? DISPONIBILIDAD_LABEL[formData.disponibilidadDiaria]
    : PENDIENTE;
  const diaUnico = esUnDia ? formData.dias[0] : null;
  const barrioUnico = diaUnico ? textoBarrio(diaUnico) : "";
  const puntoUnico = diaUnico
    ? textoPuntoPartida(diaUnico, lugaresPartida)
    : "";
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
  const ritmos = unicos(formData.dias.map((dia) => dia.ritmoVisita)).map(
    (ritmo) => RITMO_LABEL[ritmo]
  );
  const presupuestos = unicos(
    formData.dias.map((dia) => dia.presupuestoNivel)
  ).map((presupuesto) => PRESUPUESTO_LABEL[presupuesto]);
  const compania = modalidades.length > 0 ? modalidades.join(", ") : PENDIENTE;
  const interesesTexto =
    intereses.length > 0 ? intereses.join(", ") : PENDIENTE;
  const estilo =
    [ritmos.join(", "), presupuestos.join(", ")]
      .filter(Boolean)
      .join(" · ") || PENDIENTE;

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
          <dd className={clasePendiente(fechas)}>{fechas}</dd>
        </div>
        <div className="resumen-viaje__row">
          <dt>Momento del día</dt>
          <dd className={clasePendiente(momento)}>{momento}</dd>
        </div>

        {esUnDia ? (
          <>
            <div className="resumen-viaje__row">
              <dt>Barrio</dt>
              <dd className={clasePendiente(barrioUnico)}>{barrioUnico}</dd>
            </div>
            <div className="resumen-viaje__row">
              <dt>Punto de partida</dt>
              <dd className={clasePendiente(puntoUnico)}>{puntoUnico}</dd>
            </div>
          </>
        ) : (
          <div className="resumen-viaje__row">
            <dt>Días</dt>
            {formData.dias.length === 0 ? (
              <dd className="resumen-viaje__valor--pendiente">{PENDIENTE}</dd>
            ) : (
              formData.dias.map((dia) => (
                <LineaDia
                  key={dia.dia}
                  dia={dia}
                  lugaresPartida={lugaresPartida}
                />
              ))
            )}
          </div>
        )}

        <div className="resumen-viaje__row">
          <dt>Compañía</dt>
          <dd className={clasePendiente(compania)}>{compania}</dd>
        </div>
        <div className="resumen-viaje__row">
          <dt>Intereses</dt>
          <dd className={clasePendiente(interesesTexto)}>
            {interesesTexto}
          </dd>
        </div>
        <div className="resumen-viaje__row">
          <dt>Estilo</dt>
          <dd className={clasePendiente(estilo)}>{estilo}</dd>
        </div>
      </dl>

      <p className="resumen-viaje__hint">
        Revisá tus elecciones antes de generar el itinerario.
      </p>
    </details>
  );
}

export default ResumenPlanificacion;
