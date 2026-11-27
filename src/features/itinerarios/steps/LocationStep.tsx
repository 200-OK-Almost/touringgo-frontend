import { useEffect, useRef, useState } from "react";
import type { BarrioCaba } from "../../../api/types";
import { SelectableCard } from "../../../components/SelectableCard";
import { SelectableCardGroup } from "../../../components/SelectableCardGroup";
import { FaMapMarkerAlt } from "react-icons/fa";
import type { PuntoInicio } from "../types";
import { IoBusinessOutline, IoHomeOutline, IoInformationCircleOutline, IoTrailSignOutline } from "react-icons/io5";
import type { FormErrors } from "../PlanificationForm.validation";
import HospedajeSelector from "../components/HospedajeSelector";
import DaySelectorTabs from "../components/DaySelectorTabs";
import CollapsibleSection from "../components/CollapsibleSection";
import type { DiaPlanificacion } from "../planificacionFormData";
import { barrioLabel } from "../../../lib/format";
import { diaEstaCompleto } from "../lib/diasPlanificacion";

interface LocationStepProps {
  dias: DiaPlanificacion[];
  onChangeDia: (
    diaNumero: number,
    changes: Partial<DiaPlanificacion>
  ) => void;
  errors: FormErrors;
}

interface LocationFieldsProps {
  dia: DiaPlanificacion | null;
  onChange: (changes: Partial<DiaPlanificacion>) => void;
  errorBarrio?: string;
  errorPuntoInicio?: string;
  errorHospedaje?: string;
}

type BarrioAndName = {
  title: string;
  value: BarrioCaba;
};

type PuntoInicioAndName = {
  title: string;
  description: string;
  icon: React.ReactNode;
  value: PuntoInicio;
};

const BARRIOS: BarrioAndName[] = [
  { title: "Palermo", value: "Palermo" },
  { title: "Recoleta", value: "Recoleta" },
  { title: "San Telmo", value: "SanTelmo" },
  { title: "San Nicolas", value: "SanNicolas" },
  { title: "Puerto Madero", value: "PuertoMadero" },
];

const ALOJAMIENTO_OPTIONS: PuntoInicioAndName[] = [
  {
    title: "Ya tengo lugar",
    description: "Cargá tu hotel o la dirección donde te hospedás",
    icon: <IoHomeOutline />,
    value: "HospedajePropio",
  },
  {
    title: "Recomiéndame hospedaje",
    description: "Te mostramos alojamientos del barrio para elegir",
    icon: <IoBusinessOutline />,
    value: "HospedajeSugerido",
  },
  {
    title: "Estoy de paso",
    description: "Arrancamos desde el punto central del barrio",
    icon: <IoTrailSignOutline />,
    value: "NodoUrbano",
  },
];

function LocationFields({
  dia,
  onChange,
  errorBarrio,
  errorPuntoInicio,
  errorHospedaje,
}: LocationFieldsProps) {
  const barrio = dia?.barrio ?? null;
  const puntoInicio = dia?.puntoInicio ?? null;
  const hospedajeLugarGuid = dia?.hospedajeLugarGuid ?? null;
  const hospedajeBarrio = dia?.hospedajeBarrio ?? null;
  const puntoLabel =
    ALOJAMIENTO_OPTIONS.find((opcion) => opcion.value === puntoInicio)?.title ??
    null;

  const showHospedajeSection =
    puntoInicio === "HospedajePropio" || puntoInicio === "HospedajeSugerido";

  return (
    <div className="location-fields">
      <CollapsibleSection
        titleId="location-barrio-title"
        title="¿Qué barrio querés recorrer?"
        summary={barrio ? barrioLabel(barrio) : "Todavía sin elegir"}
        complete={Boolean(barrio)}
      >
        <SelectableCardGroup
          role="radiogroup"
          labelledBy="location-barrio-title"
          describedBy={errorBarrio ? "location-barrio-error" : undefined}
          className="selectable-card-group grid-5"
        >
          {BARRIOS.map((b) => (
            <SelectableCard
              key={b.value}
              title={b.title}
              icon={<FaMapMarkerAlt />}
              selected={barrio === b.value}
              onClick={() => {
                const isDifferent = barrio !== b.value;
                onChange({
                  barrio: b.value,
                  ...(puntoInicio === "HospedajeSugerido" && isDifferent
                    ? { hospedajeLugarGuid: null, hospedajeBarrio: null }
                    : {}),
                });
              }}
              variant="big"
            />
          ))}
        </SelectableCardGroup>
        {errorBarrio && (
          <div
            id="location-barrio-error"
            className="planificacion-field-error"
            role="alert"
          >
            <p>{errorBarrio}</p>
          </div>
        )}
      </CollapsibleSection>

      <CollapsibleSection
        titleId="location-punto-title"
        title="Punto de partida"
        summary={puntoLabel ?? "Todavía sin elegir"}
        complete={Boolean(puntoInicio)}
      >
        <SelectableCardGroup
          role="radiogroup"
          labelledBy="location-punto-title"
          describedBy={errorPuntoInicio ? "location-punto-error" : undefined}
          className="selectable-card-group grid-3"
        >
          {ALOJAMIENTO_OPTIONS.map((a) => (
            <SelectableCard
              key={a.value}
              title={a.title}
              icon={a.icon}
              selected={puntoInicio === a.value}
              description={a.description}
              onClick={() =>
                onChange({
                  puntoInicio: a.value,
                  hospedajeLugarGuid:
                    a.value === "NodoUrbano" ? null : hospedajeLugarGuid,
                  hospedajeBarrio:
                    a.value === "NodoUrbano" ? null : hospedajeBarrio,
                })
              }
              variant="big"
            />
          ))}
        </SelectableCardGroup>
        {errorPuntoInicio && (
          <div
            id="location-punto-error"
            className="planificacion-field-error"
            role="alert"
          >
            <p>{errorPuntoInicio}</p>
          </div>
        )}

        {puntoInicio === "NodoUrbano" && (
          <div className="location-fields__aviso">
            <IoInformationCircleOutline
              className="location-fields__aviso-icon"
              size={22}
            />
            <p>
              {barrio
                ? `Usaremos el punto central de ${barrioLabel(barrio)} como inicio del día.`
                : "Usaremos el punto central del barrio que elijas como inicio del día."}
            </p>
          </div>
        )}

        {showHospedajeSection && (
          <div className="location-fields__hospedaje">
            <HospedajeSelector
              puntoInicio={puntoInicio}
              barrio={barrio}
              selectedLugarId={hospedajeLugarGuid}
              onSelectLugar={(id, lugar) =>
                onChange({
                  hospedajeLugarGuid: id,
                  hospedajeBarrio: lugar?.barrio ?? null,
                })
              }
              error={errorHospedaje}
            />
          </div>
        )}
      </CollapsibleSection>
    </div>
  );
}

function LocationStep({ dias, onChangeDia, errors }: LocationStepProps) {
  const [diaActivo, setDiaActivo] = useState(1);
  const esUnDia = dias.length <= 1;
  const diaSeleccionado = dias.some((dia) => dia.dia === diaActivo)
    ? diaActivo
    : dias[0]?.dia ?? 1;
  const dia = dias.find((d) => d.dia === diaSeleccionado) ?? null;
  const puedeCopiarBarrio = Boolean(dias[0]?.barrio);
  const tabsRef = useRef<HTMLDivElement | null>(null);
  const completitudRef = useRef<{ dia: number; completa: boolean } | null>(
    null
  );

  // Al completar el día activo, lleva al selector de días para elegir el siguiente
  useEffect(() => {
    const completa = dia ? diaEstaCompleto(dia) : false;
    const anterior = completitudRef.current;
    completitudRef.current = { dia: diaSeleccionado, completa };

    if (!anterior || anterior.dia !== diaSeleccionado) {
      return;
    }

    const esUltimoDia = diaSeleccionado === dias[dias.length - 1]?.dia;
    const debeDesplazar =
      !anterior.completa && completa && !esUnDia && !esUltimoDia;

    if (!debeDesplazar) {
      return;
    }

    const prefiereReducirMovimiento =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    tabsRef.current?.scrollIntoView?.({
      behavior: prefiereReducirMovimiento ? "auto" : "smooth",
      block: "center",
    });
  }, [dias, dia, diaSeleccionado, esUnDia]);

  function aplicarMismoBarrio() {
    const primerDia = dias[0];

    if (!primerDia?.barrio) {
      return;
    }

    dias.slice(1).forEach((diaRestante) => {
      const cambiaBarrio = diaRestante.barrio !== primerDia.barrio;

      onChangeDia(diaRestante.dia, {
        barrio: primerDia.barrio,
        ...(primerDia.puntoInicio
          ? {
              puntoInicio: primerDia.puntoInicio,
              hospedajeLugarGuid: primerDia.hospedajeLugarGuid,
              hospedajeBarrio: primerDia.hospedajeBarrio,
            }
          : cambiaBarrio
            ? { hospedajeLugarGuid: null, hospedajeBarrio: null }
            : {}),
      });
    });
  }

  return (
    <>
      {!esUnDia && (
        <div className="location-days">
          <div className="location-days__header">
            <div className="planificacion-form-header">
              <h3>¿Qué barrio querés recorrer cada día?</h3>
              <p className="planificacion-form-description text-muted">
                Elegí un barrio y un punto de partida para cada día del viaje.
              </p>
            </div>
            <button
              type="button"
              className="location-days__shortcut"
              onClick={aplicarMismoBarrio}
              disabled={!puedeCopiarBarrio}
            >
              Usar el mismo barrio/alojamiento para todos los días
            </button>
          </div>

          <div ref={tabsRef} className="location-days__tabs">
            <DaySelectorTabs
              dias={dias}
              diaActivo={diaSeleccionado}
              onChange={setDiaActivo}
              idPrefix="location-day"
              panelId="location-day-panel"
            />
          </div>
        </div>
      )}

      {errors.dias && (
        <div
          id="planificacion-dias-error"
          className="planificacion-field-error"
          role="alert"
          tabIndex={-1}
        >
          <p>{errors.dias}</p>
        </div>
      )}

      <div
        id="location-day-panel"
        role={esUnDia ? undefined : "tabpanel"}
        aria-labelledby={
          esUnDia ? undefined : `location-day-${diaSeleccionado}`
        }
      >
        <LocationFields
          dia={dia}
          onChange={(changes) => {
            if (dia) {
              onChangeDia(dia.dia, changes);
            }
          }}
          errorBarrio={esUnDia ? errors.barrio : undefined}
          errorPuntoInicio={esUnDia ? errors.puntoInicio : undefined}
          errorHospedaje={esUnDia ? errors.hospedajeLugarGuid : undefined}
        />
      </div>
    </>
  );
}

export default LocationStep;
