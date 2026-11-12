import { IoArrowBackOutline, IoArrowForwardOutline, IoSparkles, IoSparklesOutline } from "react-icons/io5"
import "./PlanificacionFormNavigation.css"

export interface PlanificacionFormNavigationProps {
  onBack: () => void
  onNext: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

function PlanificacionFormNavigation(
  {onBack, onNext, isFirstStep, isLastStep}: PlanificacionFormNavigationProps
) {
  return (
    <div className="form-navigation">
      <button
        className="form-navigation-button form-back-button"
        onClick={onBack}
      >
        <IoArrowBackOutline />
        <p>{!isFirstStep ? "Atrás" : "Volver al inicio"}</p>
      </button>

      <button
        className={`form-navigation-button ${isLastStep ? "form-confirm-button" : "form-next-button"}`}
        onClick={onNext}
      >
        <p>{isLastStep ? "Armar itinerario con IA" : "Siguiente"}</p>
        {isLastStep ? <IoSparkles /> : <IoArrowForwardOutline />} 
      </button>
    </div>
  )
}
export default PlanificacionFormNavigation