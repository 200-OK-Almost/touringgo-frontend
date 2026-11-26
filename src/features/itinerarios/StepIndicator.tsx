import { IoCheckmark } from "react-icons/io5";
import "./StepIndicator.css";

export interface StepIndicatorStep {
  label: string;
  shortLabel?: string;
}

export interface StepIndicatorProps {
  stepLabel: string;
  currentStep: number;
  totalSteps: number;
  steps?: StepIndicatorStep[];
  onStepSelect?: (step: number) => void;
}

function StepIndicator({stepLabel, currentStep, totalSteps, steps = [], onStepSelect}: StepIndicatorProps) {
    const stepNumber = currentStep + 1;

    return (
      <div className="step-indicator">
        <div className="step-indicator-info">
          <h2
            id="planificacion-step-title"
            className="step-indicator-label"
            tabIndex={-1}
          >
            {stepLabel}
          </h2>
          <p className="step-indicator-counter" aria-live="polite">
            Paso {stepNumber} de {totalSteps}
          </p>
        </div>

        {steps.length > 0 && (
          <nav
            className="step-indicator-nav"
            aria-label="Pasos del planificador"
          >
            <ol className="step-indicator-list">
              {steps.map((step, index) => {
                const isCurrent = index === currentStep;
                const isCompleted = index < currentStep;

                return (
                  <li key={step.label} className="step-indicator-item">
                    <button
                      type="button"
                      className={`step-indicator-step ${
                        isCurrent ? "step-indicator-step--current" : ""
                      } ${isCompleted ? "step-indicator-step--completed" : ""}`}
                      onClick={
                        isCompleted
                          ? () => onStepSelect?.(index)
                          : undefined
                      }
                      disabled={!isCompleted}
                      aria-current={isCurrent ? "step" : undefined}
                      aria-label={`Paso ${index + 1}: ${step.label}${
                        isCompleted ? " (completado)" : ""
                      }`}
                    >
                      <span
                        className="step-indicator-step__marker"
                        aria-hidden="true"
                      >
                        {isCompleted ? <IoCheckmark /> : index + 1}
                      </span>
                      <span className="step-indicator-step__label">
                        {step.shortLabel ?? step.label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>
        )}

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
