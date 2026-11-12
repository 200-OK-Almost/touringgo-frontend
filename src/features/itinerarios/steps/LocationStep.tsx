import type { BarrioCaba } from "../../../api/types";
import { SelectableCard } from "../../../components/SelectableCard";
import { FaMapMarkerAlt } from "react-icons/fa";
import type { PuntoInicio } from "../types";
import { IoBusinessOutline, IoHomeOutline, IoTrailSignOutline } from "react-icons/io5";
import type { FormErrors } from "../PlanificationForm.validation";

interface LocationStepProps {
  puntoInicio: PuntoInicio | null
  barrioInicio: BarrioCaba | null;
  onChange: (changes: {
    barrioInicio?: BarrioCaba
    puntoInicio?: PuntoInicio
  }) => void;
  errors: FormErrors
}

type BarrioAndName = {
  title: string
  value: BarrioCaba
}
type PuntoInicioAndName = {
  title: string
  description: string
  icon: React.ReactNode
  value: PuntoInicio
}

function LocationStep({puntoInicio, barrioInicio, onChange, errors}: LocationStepProps) {

  const barrios: BarrioAndName[] = [
    {title: "Palermo", value: "Palermo"},
    {title: "Recoleta", value: "Recoleta"},
    {title: "San Telmo", value: "SanTelmo"},
    {title: "San Nicolas", value: "SanNicolas"},
    {title: "Puerto Madero", value: "PuertoMadero"},
  ]

  const alojamientoOptions: PuntoInicioAndName[] = [
    {
      title: "Ya tengo lugar", description: "Dirección de hotel",
      icon: <IoHomeOutline /> ,value: "hospedajeDefinido"
    },
    {
      title: "Recomiéndenme hospedaje", description: "Cerca del recorrido", 
      icon: <IoBusinessOutline />,value: "recomendarHospedaje"},
    {
      title: "Estoy de paso", description: "Punto central del barrio", 
      icon: <IoTrailSignOutline /> ,value: "sinHospedaje"
    },
  ]

  return (
    <>
    <h2>¿Qué barrio querés recorrer?</h2>
    <div className="selectable-card-group horizontal-group">
      {barrios.map(b => 
        <SelectableCard 
          title={b.title}
          icon={<FaMapMarkerAlt />}
          selected={barrioInicio === b.value}
          onClick={() => onChange({barrioInicio: b.value})}
          variant="big"
        />
      )}
    </div>
    {errors.barrioInicio && <div className="planificacion-field-error">
      <p>{errors.barrioInicio}</p>
    </div>
    }
    <h2>Punto de partida</h2>
    <div className="selectable-card-group horizontal-group">
      {alojamientoOptions.map(a => 
        <SelectableCard 
          title={a.title}
          icon={a.icon}
          selected={puntoInicio === a.value}
          description={a.description}
          onClick={() => onChange({puntoInicio: a.value})}
          variant="big"
        />
      )}
    </div>
    {errors.puntoInicio && <div className="planificacion-field-error">
      <p>{errors.puntoInicio}</p>
    </div>
    }
    </>
  )
}
export default LocationStep