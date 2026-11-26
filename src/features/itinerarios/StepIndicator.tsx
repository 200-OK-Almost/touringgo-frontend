import "./StepIndicator.css"

export interface StepIndicatorProps {
  stepLabel: string
  currentStep: number
  totalSteps: number
}

function StepIndicator({stepLabel, currentStep, totalSteps}: StepIndicatorProps) {
    const stepNumber = currentStep + 1;

    return (
      <div className="step-indicator">
        <div className="step-indicator-info">
          <p className="step-indicator-label">{stepLabel}</p>
          <p className="step-indicator-counter" aria-live="polite">
            Paso {stepNumber} de {totalSteps}
          </p>
        </div>
        <div
          className="step-indicator-bar"
          role="progressbar"
          aria-label="Progreso del planificador"
          aria-valuemin={1}
          aria-valuemax={totalSteps}
          aria-valuenow={stepNumber}
          aria-valuetext={`Paso ${stepNumber} de ${totalSteps}: ${stepLabel}`}
        >
          <div
           className="step-indicator-progress"
           style={{width: (stepNumber * 100) / totalSteps + "%" }}
          >
           </div>
        </div>
      </div>
    );
}
export default StepIndicator