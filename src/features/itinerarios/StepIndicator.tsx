import "./StepIndicator.css"

export interface StepIndicatorProps {
  stepLabel: string
  currentStep: number
  totalSteps: number
}

function StepIndicator({stepLabel, currentStep, totalSteps}: StepIndicatorProps) {
    return (
      <div className="step-indicator">
        <div className="step-indicator-info">
          <p className="step-indicator-label">{stepLabel}</p>
          <p className="step-indicator-counter">Paso {currentStep + 1} de {totalSteps}</p>
        </div>
        <div className="step-indicator-bar">
          <div
           className="step-indicator-progress"
           style={{width: ((currentStep+1) * 100) / totalSteps + "%" }}
          >
           </div>
        </div>
      </div>
    );
}
export default StepIndicator