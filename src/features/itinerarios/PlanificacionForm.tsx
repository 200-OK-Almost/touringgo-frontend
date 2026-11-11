import { useState } from "react";
import StepIndicator from "./StepIndicator";
import DurationStep from "./steps/DurationStep";
import LocationStep from "./steps/LocationStep";
import TravelCompanionsStep from "./steps/TravelCompanionsStep";
import InterestsStep from "./steps/InterestsStep";
import TravelStyleStep from "./steps/TravelStyleStep";
import PlanificacionFormNavigation from "./PlanificacionFormNavigation";

import "./PlanificacionForm.css"

export interface ItineraryFormData {
  barrioInicio: string | null;
  puntoInicio: string | null;

  cantidadDias: number;
  disponibilidadDiaria: string;

  modalidadViaje: string;

  categoriasPrioritarias: string[];

  ritmo: string;
  presupuesto: string;
}

function PlanificacionForm() {
  const [currentStepCounter, setCurrentStepCounter] = useState(0);

  const steps = [
    { label: "Barrio y punto de partida", Component: LocationStep },
    { label: "Duración", Component: DurationStep },
    { label: "Compañía", Component: TravelCompanionsStep },
    { label: "Intereses", Component: InterestsStep },
    { label: "Estilo", Component: TravelStyleStep }
  ];

  const CurrentStep = steps[currentStepCounter];
  
  function handleNext() {
    setCurrentStepCounter(prev => {
      if (prev >= steps.length-1) return prev
      return prev + 1
    })
  }
  function handleBack() {
    setCurrentStepCounter(prev => {
      if (prev <= 0) return prev
      return prev - 1
    })
  }
  
  return (
    <>
    <main className="planificacion-form-main">
      <StepIndicator 
        currentStep={currentStepCounter}
        stepLabel={CurrentStep.label}
        totalSteps={steps.length}
      />
      
      <CurrentStep.Component />

      <PlanificacionFormNavigation 
        onBack={handleBack}
        onNext={handleNext}
        isFirstStep={currentStepCounter === 0}
        isLastStep={currentStepCounter === steps.length - 1}    
      />

    </main>
    </>
    );
}
export default PlanificacionForm