import { IoArrowBackOutline, IoArrowForwardOutline } from "react-icons/io5"
import "./FormNavigation.css"

export interface FormNavigationProps {
  onBack: () => void
  onNext: () => void
  isFirstStep: boolean
  isLastStep: boolean
  isSubmitLoading: boolean
  lastStepButtonLabel: string
  lastStepButtonIcon?: React.ReactNode
  lastStepButtonLabelLoading: string
}

function FormNavigation({
  onBack, 
  onNext, 
  isFirstStep, 
  isLastStep, 
  isSubmitLoading,
  lastStepButtonLabel,
  lastStepButtonIcon,
  lastStepButtonLabelLoading
}: FormNavigationProps
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
        {isLastStep ? lastStepButtonIcon : <IoArrowForwardOutline />} 
        <p>
          {isLastStep ? 
            isSubmitLoading ? lastStepButtonLabelLoading : lastStepButtonLabel
            : "Siguiente"}
        </p>
        
      </button>
    </div>
  )
}
export default FormNavigation