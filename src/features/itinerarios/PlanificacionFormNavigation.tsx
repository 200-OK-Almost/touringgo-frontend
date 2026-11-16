import { IoArrowBackOutline, IoArrowForwardOutline, IoSparkles } from "react-icons/io5"
import "./PlanificacionFormNavigation.css"

export interface PlanificacionFormNavigationProps {
  onBack: () => void
  onNext: () => void
  isFirstStep: boolean
  isLastStep: boolean
  isSubmitLoading: boolean
}

function PlanificacionFormNavigation(
  {onBack, onNext, isFirstStep, isLastStep, isSubmitLoading}: PlanificacionFormNavigationProps
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
        className={
          `form-navigation-button 
          ${isLastStep ? "form-confirm-button" : "form-next-button"}
          ${isSubmitLoading && "form-confirm-button-loading"}`
        }
        onClick={onNext}
        disabled={isLastStep && isSubmitLoading}
      >
        {isLastStep ? <IoSparkles /> : <IoArrowForwardOutline />} 
        <p>
          {isLastStep ? 
            isSubmitLoading ? "Generando..." : "Armar itinerario con IA"
            : "Siguiente"}
        </p>
        
      </button>
    </div>
  )
}
export default PlanificacionFormNavigation