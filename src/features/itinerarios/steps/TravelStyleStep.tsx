import { IoCafeOutline, IoWalkOutline, IoFlashOutline, IoBusOutline, IoCarOutline, IoHourglassOutline } from "react-icons/io5";
import { SelectableCard } from "../../../components/SelectableCard";
import type { RitmoVisita, TipoTransporte } from "../../profile/types";
import { BsGem, BsPiggyBank, BsWallet2 } from "react-icons/bs";
import type { FormErrors } from "../PlanificationForm.validation";

type RitmoVisitaOption = {
  title: string, 
  description: string,
  icon: React.ReactNode
  value: RitmoVisita
}

type TipoTransporteOption = {
  title: string, 
  description: string,
  icon: React.ReactNode
  value: TipoTransporte
}

type PresupuestoOption = {
  title: string, 
  description: string,
  value: number
  icon: React.ReactNode
}

interface TravelStyleStepProps {
  ritmoVisita: RitmoVisita | null, 
  presupuestoNivel: number | null, 
  tipoTransporte: TipoTransporte | null,
  onChange: (changes: {
    ritmoVisita?: RitmoVisita | null, 
    tipoTransporte?: TipoTransporte | null, 
    presupuestoNivel?: number | null, 
  }) => void;
  errors: FormErrors

}

function TravelStyleStep({ritmoVisita, tipoTransporte, presupuestoNivel, onChange, errors}: TravelStyleStepProps) {

  const ritmoVisitaOptions: RitmoVisitaOption[] = [
    { 
      value: "Relajado", title: "Relajado", description: "Pausado y contemplativo, con pocas paradas y más tiempo libre.", 
      icon: <IoCafeOutline /> 
    },
    { 
      value: "Moderado", title: "Moderado", description: "Equilibrado entre descanso y actividades programadas.", 
      icon: <IoHourglassOutline /> 
    },
    { 
      value: "Activo", title: "Activo", description: "Días intensos aprovechando al máximo cada atracción.", 
      icon: <IoFlashOutline /> 
    },
  ]
  const transporteOptions: TipoTransporteOption[] = [
    { 
      value: "Caminando", title: "Caminando (A pie)", 
      description: "Prioriza lugares cercanos y recorridos a pie", icon: <IoWalkOutline /> 
    },
    { 
      value: "TransportePublico", title: "Transporte público", 
      description: "Combina caminatas con colectivos, subtes y trenes.", icon: <IoBusOutline />

    },
    { 
      value: "VehiculoPersonal", title: "Vehículo personal", 
      description: "Considera desplazamientos en auto entre las distintas zonas", icon: <IoCarOutline />

    },
  ];
  

  const presupuestoOptions: PresupuestoOption[] = [
    { 
      value: 1, title: "Económico", 
      description: "Prioriza actividades gratuitas o de bajo costo", icon: <BsPiggyBank /> 
    },
    { 
      value: 2, title: "Equilibrado", 
      description: "Combina opciones gratuitas y de bajo costo con algunas experiencias pagas", icon: <BsWallet2 /> 
    },
    { 
      value: 3, title: "Flexible", 
      description: "Considera una mayor variedad de actividades y experiencias", icon: <BsGem /> 
    },
  ]

  return (
    <>
    <div className="planificacion-form-header">
      <h2>Ritmo</h2>
    </div>
    <div className="selectable-card-group grid-3">
      {ritmoVisitaOptions.map(r => 
        <SelectableCard 
          key={r.value}
          title={r.title}
          selected={ritmoVisita === r.value}
          icon={r.icon}
          description={r.description}
          onClick={() => onChange({ritmoVisita: r.value})}
          variant="big"
        />
      )}
    </div>
    {errors.ritmoVisita && <div className="planificacion-field-error">
      <p>{errors.ritmoVisita}</p>
    </div>
    }
    <div className="planificacion-form-header">
      <h2>Medio de transporte</h2>
    </div>
    <div className="selectable-card-group grid-3">
      {transporteOptions.map(t => 
        <SelectableCard 
          key={t.value}
          title={t.title}
          icon={t.icon}
          description={t.description}
          selected={tipoTransporte === t.value}
          onClick={() => onChange({tipoTransporte: t.value})}
          variant="big"
        />
      )}
    </div>
    {errors.tipoTransporte && <div className="planificacion-field-error">
      <p>{errors.tipoTransporte}</p>
    </div>
    }
    <h2>Presupuesto</h2>
    <div className="selectable-card-group grid-3">
      {presupuestoOptions.map(p => 
        <SelectableCard 
          key={p.value}
          title={p.title}
          icon={p.icon}
          description={p.description}
          selected={presupuestoNivel === p.value}
          onClick={() => onChange({presupuestoNivel: p.value})}
          variant="big"
        />
      )}
    </div>
    {errors.presupuestoNivel && <div className="planificacion-field-error">
      <p>{errors.presupuestoNivel}</p>
    </div>
    }

    </>
  )
}
export default TravelStyleStep