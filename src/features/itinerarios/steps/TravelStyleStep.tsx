import { IoCafeOutline, IoFlashOutline } from "react-icons/io5";
import { SelectableCard } from "../../../components/SelectableCard";
import { SelectableCardGroup } from "../../../components/SelectableCardGroup";
import type { RitmoCaminata } from "../types";
import { BsGem, BsPiggyBank, BsWallet2 } from "react-icons/bs";
import type { FormErrors } from "../PlanificationForm.validation";
import type { NivelPresupuesto } from "../../viaje/types";

type RitmoVisitaOption = {
  title: string, 
  description: string,
  icon: React.ReactNode
  value: RitmoCaminata
}

type PresupuestoOption = {
  title: string, 
  description: string,
  value: NivelPresupuesto
  icon: React.ReactNode
}

interface TravelStyleStepProps {
  ritmoVisita: RitmoCaminata | null, 
  presupuestoNivel: NivelPresupuesto | null, 
  onChange: (changes: {
    ritmoVisita?: RitmoCaminata | null, 
    presupuestoNivel?: NivelPresupuesto | null, 
  }) => void;
  errors: FormErrors

}

function TravelStyleStep({ritmoVisita, presupuestoNivel, onChange, errors}: TravelStyleStepProps) {

  const ritmoVisitaOptions: RitmoVisitaOption[] = [
    { 
      value: "Tranquilo", title: "Relajado", description: "Pausado y contemplativo, con pocas paradas y más tiempo libre.", 
      icon: <IoCafeOutline /> 
    },
    // { 
    //   value: "Moderado", title: "Moderado", description: "Equilibrado entre descanso y actividades programadas.", 
    //   icon: <IoHourglassOutline /> 
    // },
    { 
      value: "Activo", title: "Activo", description: "Días intensos aprovechando al máximo cada atracción.", 
      icon: <IoFlashOutline /> 
    },
  ]

  const presupuestoOptions: PresupuestoOption[] = [
    { 
      value: "Economico", title: "Económico", 
      description: "Prioriza actividades gratuitas o de bajo costo", icon: <BsPiggyBank /> 
    },
    { 
      value: "Equilibrado", title: "Equilibrado", 
      description: "Combina opciones gratuitas y de bajo costo con algunas experiencias pagas", icon: <BsWallet2 /> 
    },
    { 
      value: "SinRestricciones", title: "Flexible", 
      description: "Considera una mayor variedad de actividades y experiencias", icon: <BsGem /> 
    },
  ]

  return (
    <>
    <div className="planificacion-form-header">
      <h3 id="style-ritmo-title" tabIndex={-1}>Ritmo</h3>
    </div>
    <SelectableCardGroup
      role="radiogroup"
      labelledBy="style-ritmo-title"
      describedBy={errors.ritmoVisita ? "style-ritmo-error" : undefined}
      className="selectable-card-group grid-2"
    >
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
    </SelectableCardGroup>
    {errors.ritmoVisita && <div id="style-ritmo-error" className="planificacion-field-error" role="alert">
      <p>{errors.ritmoVisita}</p>
    </div>
    }
    <div className="planificacion-form-header">
      <h3 id="style-presupuesto-title" tabIndex={-1}>Presupuesto</h3>
      <p className="planificacion-form-description text-muted">
        Elegí cómo querés manejar los costos del recorrido.
      </p>
    </div>
    <SelectableCardGroup
      role="radiogroup"
      labelledBy="style-presupuesto-title"
      describedBy={
        errors.presupuestoNivel ? "style-presupuesto-error" : undefined
      }
      className="selectable-card-group grid-3"
    >
      {presupuestoOptions.map(p => 
        <SelectableCard 
          key={p.value}
          title={p.title}
          icon={p.icon}
          description={p.description}
          selected={presupuestoNivel == p.value}
          onClick={() => onChange({presupuestoNivel: p.value})}
          variant="big"
        />
      )}
    </SelectableCardGroup>
    {errors.presupuestoNivel && <div id="style-presupuesto-error" className="planificacion-field-error" role="alert">
      <p>{errors.presupuestoNivel}</p>
    </div>
    }

    </>
  )
}
export default TravelStyleStep