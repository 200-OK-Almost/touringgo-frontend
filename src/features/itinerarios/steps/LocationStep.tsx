import type { BarrioCaba } from "../../../api/types";
import { SelectableCard } from "../../../components/SelectableCard";
import { FaMapMarkerAlt } from "react-icons/fa";
import type { PuntoInicio } from "../types";
import { IoBusinessOutline, IoHomeOutline, IoTrailSignOutline } from "react-icons/io5";
import type { FormErrors } from "../PlanificationForm.validation";
import HospedajeSelector from "../components/HospedajeSelector";

interface LocationStepProps {
  puntoInicio: PuntoInicio | null;
  barrio: BarrioCaba | null;
  hospedajeLugarGuid: string | null;
  hospedajeBarrio: BarrioCaba | null;
  onChange: (changes: {
    barrio?: BarrioCaba;
    puntoInicio?: PuntoInicio;
    hospedajeLugarGuid?: string | null;
    hospedajeBarrio?: BarrioCaba | null;
  }) => void;
  errors: FormErrors;
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

function LocationStep({
  puntoInicio,
  barrio,
  hospedajeLugarGuid,
  hospedajeBarrio,
  onChange,
  errors,
}: LocationStepProps) {
  const barrios: BarrioAndName[] = [
    { title: "Palermo", value: "Palermo" },
    { title: "Recoleta", value: "Recoleta" },
    { title: "San Telmo", value: "SanTelmo" },
    { title: "San Nicolas", value: "SanNicolas" },
    { title: "Puerto Madero", value: "PuertoMadero" },
  ];

  const alojamientoOptions: PuntoInicioAndName[] = [
    {
      title: "Ya tengo lugar",
      description: "Dirección de hotel",
      icon: <IoHomeOutline />,
      value: "hospedajeDefinido",
    },
    {
      title: "Recomiéndenme hospedaje",
      description: "Cerca del recorrido",
      icon: <IoBusinessOutline />,
      value: "recomendarHospedaje",
    },
    {
      title: "Estoy de paso",
      description: "Punto central del barrio",
      icon: <IoTrailSignOutline />,
      value: "sinHospedaje",
    },
  ];

  const showHospedajeSection =
    puntoInicio === "hospedajeDefinido" || puntoInicio === "recomendarHospedaje";

  return (
    <>
      <h2>¿Qué barrio querés recorrer?</h2>
      <div className="selectable-card-group grid-5">
        {barrios.map((b) => (
          <SelectableCard
            key={b.value}
            title={b.title}
            icon={<FaMapMarkerAlt />}
            selected={barrio === b.value}
            onClick={() => {
              const isDifferent = barrio !== b.value;
              onChange({
                barrio: b.value,
                ...(puntoInicio === "recomendarHospedaje" && isDifferent
                  ? { hospedajeLugarGuid: null, hospedajeBarrio: null }
                  : {}),
              });
            }}
            variant="big"
          />
        ))}
      </div>
      {errors.barrio && (
        <div className="planificacion-field-error">
          <p>{errors.barrio}</p>
        </div>
      )}

      <h2>Punto de partida</h2>
      <div className="selectable-card-group grid-3">
        {alojamientoOptions.map((a) => (
          <SelectableCard
            key={a.value}
            title={a.title}
            icon={a.icon}
            selected={puntoInicio === a.value}
            description={a.description}
            onClick={() =>
              onChange({
                puntoInicio: a.value,
                hospedajeLugarGuid: a.value === "sinHospedaje" ? null : hospedajeLugarGuid,
                hospedajeBarrio: a.value === "sinHospedaje" ? null : hospedajeBarrio,
              })
            }
            variant="big"
          />
        ))}
      </div>
      {errors.puntoInicio && (
        <div className="planificacion-field-error">
          <p>{errors.puntoInicio}</p>
        </div>
      )}

      {/* Sección de búsqueda y selección de hospedaje */}
      {showHospedajeSection && (
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
          error={errors.hospedajeLugarGuid}
        />
      )}
    </>
  );
}

export default LocationStep;
