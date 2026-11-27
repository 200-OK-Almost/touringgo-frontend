import { IoArrowBackOutline, IoArrowForwardOutline, IoSparkles } from "react-icons/io5"
import "./PlanificacionFormNavigation.css"

export interface PlanificacionFormNavigationProps {
  onBack: () => void
  onNext: () => void
  isFirstStep: boolean
  isLastStep: boolean
  isSubmitLoading: boolean
  nextLabel?: string
}

function PlanificacionFormNavigation(
  {onBack, onNext, isFirstStep, isLastStep, isSubmitLoading, nextLabel}: PlanificacionFormNavigationProps
) {
  return (
    <div className="form-navigation" aria-busy={isSubmitLoading}>
      <button
        className="form-navigation-button form-back-button"
        onClick={onBack}
        disabled={isSubmitLoading}
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
        disabled={isSubmitLoading}
      >
        {isLastStep ? (
          isSubmitLoading ? (
            <span className="form-navigation-spinner" aria-hidden="true" />
          ) : (
            <IoSparkles />
          )
        ) : (
          <IoArrowForwardOutline />
        )}
        <p>
          {isLastStep ? 
            isSubmitLoading ? "Generando..." : "Armar itinerario con IA"
            : nextLabel
              ? `Siguiente: ${nextLabel}`
              : "Siguiente"}
        </p>
        
      </button>
    </div>
  )
}
export default PlanificacionFormNavigation