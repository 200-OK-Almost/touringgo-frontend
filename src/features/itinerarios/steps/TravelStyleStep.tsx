import { IoCafeOutline, IoWalkOutline, IoFlashOutline, IoBusOutline, IoCarOutline } from "react-icons/io5";
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
      value: "relajado", title: "Relajado", description: "Pausado y contemplativo, con pocas paradas y más tiempo libre.", 
      icon: <IoCafeOutline /> 
    },
    { 
      value: "moderado", title: "Moderado", description: "Equilibrado entre descanso y actividades programadas.", 
      icon: <IoWalkOutline /> 
    },
    { 
      value: "activo", title: "Activo", description: "Días intensos aprovechando al máximo cada atracción.", 
      icon: <IoFlashOutline /> 
    },
  ]
  const transporteOptions: TipoTransporteOption[] = [
    { value: "Caminando", title: "Caminando (A pie)", icon: <IoWalkOutline /> },
    { value: "TransportePublico", title: "Transporte público", icon: <IoBusOutline /> },
    { value: "VehiculoPersonal", title: "Vehículo personal", icon: <IoCarOutline /> },
  ];
  

  const presupuestoOptions: PresupuestoOption[] = [
    { 
      value: 1, title: "Económico", description: "$", 
      icon: <BsPiggyBank /> 
    },
    { 
      value: 2, title: "Equilibrado", description: "$$", 
      icon: <BsWallet2 /> 
    },
    { 
      value: 3, title: "Sin restricciones", description: "$$$", 
      icon: <BsGem /> 
    },
  ]

  return (
    <>
    <h2>Ritmo</h2>
    <div className="selectable-card-group horizontal-group">
      {ritmoVisitaOptions.map(r => 
        <SelectableCard 
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
    <h2>Medio de transporte</h2>
    <div className="selectable-card-group horizontal-group">
      {transporteOptions.map(t => 
        <SelectableCard 
          title={t.title}
          icon={t.icon}
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
    <div className="selectable-card-group horizontal-group">
      {presupuestoOptions.map(p => 
        <SelectableCard 
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