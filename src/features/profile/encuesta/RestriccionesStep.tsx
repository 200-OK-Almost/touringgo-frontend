import { IoLeafOutline } from "react-icons/io5";
import type { TipoDieta } from "../types";
import { SelectableCard } from "../../../components/SelectableCard";
import { FaRestroom, FaWheelchair } from "react-icons/fa";

interface RestriccionesStepProps {
  requiereRecorridoSinEscalones: boolean
  requiereBanoAccesible: boolean
  tipoDietas: TipoDieta[]
  onChange: (changes: {
    requiereRecorridoSinEscalones?: boolean
    requiereBanoAccesible?: boolean
    tipoDietas?: TipoDieta[]
  }) => void;
}

type TipoDietaOption = {
  title: string;
  description: string;
  icon: React.ReactNode;
  value: TipoDieta;
}

function RestriccionesStep({
  requiereRecorridoSinEscalones,
  requiereBanoAccesible,
  tipoDietas,
  onChange
} : RestriccionesStepProps) {
  const tipoDietaOptions: TipoDietaOption[] = [
    {
      title: "Vegano", value: "Vegano", description: "...",
      icon: <IoLeafOutline />
    },
    {
      title: "Vegetariano", value: "Vegetariano", description: "...",
      icon: <IoLeafOutline />
    },
    {
      title: "Celiaco", value: "Celiaco", description: "...",
      icon: <IoLeafOutline />
    }
  ]

  return (
    <>
    <div className="planificacion-form-header">
      <h2>Restricciones y Accesibilidad</h2>
      <p className="planificacion-form-description text-muted">
        Filtros automáticos para adaptar lugares y gastronomía a tus necesidades.
      </p>
    </div>
    <div className="selectable-card-group grid-2">
      <SelectableCard
        title="Recorrido sin escalones"
        description="Priorizar accesos y trayectos sin escaleras, con rampas o ascensores."
        icon={<FaWheelchair size={22} className="profile-switch-card__icon" />}
        selected={requiereRecorridoSinEscalones}
        variant="big" 
        selectionIndicator="checkbox"
        onClick={() => onChange({requiereRecorridoSinEscalones: !requiereRecorridoSinEscalones})}
      />
      <SelectableCard
        title="Baño accesible"
        description="Priorizar instalaciones con sanitarios adaptados para personas con movilidad reducida."
        icon={<FaRestroom size={24} />}
        selected={requiereBanoAccesible}
        variant="big" 
        selectionIndicator="checkbox"
        onClick={() => onChange({requiereBanoAccesible: !requiereBanoAccesible})}
      />
    </div>
    <div className="planificacion-form-header duration-step__availability-header">
      <h2>Preferencia y tipo de dieta</h2>
      <p className="planificacion-form-description text-muted">
        Selecciona las opciones que aplican a tus hábitos o restricciones alimentarias.
      </p>
    </div>
    <div className="selectable-card-group grid-3">
      {tipoDietaOptions.map((tipo) => (
        <SelectableCard
          key={tipo.value}
          title={tipo.title}
          icon={tipo.icon}
          description={tipo.description}
          selected={tipoDietas.includes(tipo.value)}
          variant="big" 
          selectionIndicator="checkbox"
          onClick={() => {
            const index = tipoDietas.indexOf(tipo.value)
            index != -1 ?
              tipoDietas.splice(index, 1) : tipoDietas.push(tipo.value)

            onChange({ tipoDietas: tipoDietas })
          }}
        />
      ))}
    </div>
    </>
  )
}
export default RestriccionesStep