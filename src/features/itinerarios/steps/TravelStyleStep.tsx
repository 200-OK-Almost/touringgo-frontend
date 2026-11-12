import { IoCafeOutline, IoWalkOutline, IoFlashOutline } from "react-icons/io5";
import { SelectableCard } from "../../../components/SelectableCard";
import type { RitmoVisita } from "../../profile/types";
import { BsGem, BsPiggyBank, BsWallet2 } from "react-icons/bs";

type RitmoVisitaOption = {
  title: string, 
  description: string,
  icon: React.ReactNode
  value: RitmoVisita
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
  onChange: (changes: {
    presupuestoNivel?: number | null, 
    ritmoVisita?: RitmoVisita | null, 
  }) => void;
}

function TravelStyleStep({ritmoVisita, presupuestoNivel, onChange}: TravelStyleStepProps) {

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
    </>
  )
}
export default TravelStyleStep