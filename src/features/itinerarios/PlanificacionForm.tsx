import { useState } from "react";
import StepIndicator from "./StepIndicator";
import DurationStep from "./steps/DurationStep";
import LocationStep from "./steps/LocationStep";
import TravelCompanionsStep from "./steps/TravelCompanionsStep";
import InterestsStep from "./steps/InterestsStep";
import TravelStyleStep from "./steps/TravelStyleStep";
import PlanificacionFormNavigation from "./PlanificacionFormNavigation";

import "./PlanificacionForm.css"
import type { BarrioCaba } from "../../api/types";
import type { DisponibilidadDiaria, PuntoInicio } from "./types";

export interface ItineraryFormData {
  barrioInicio: BarrioCaba | null;
  puntoInicio: PuntoInicio | null;
  hospedajeDireccion?: string | null;

  cantidadDias: number | null;
  disponibilidadDiaria: DisponibilidadDiaria;

  modalidadViaje: string;

  categoriasPrioritarias: string[];

  ritmo: string;
  presupuesto: string;
}

function PlanificacionForm() {
  const [currentStepCounter, setCurrentStepCounter] = useState(0);

  const steps = [
    { label: "Barrio y punto de partida", Component: LocationStep },
    { label: "Duración y disponibilidad diaria", Component: DurationStep },
    { label: "Compañía", Component: TravelCompanionsStep },
    { label: "Intereses", Component: InterestsStep },
    { label: "Estilo", Component: TravelStyleStep }
  ];

  const currentStep = steps[currentStepCounter];
  
  function updateFormData(
    changes: Partial<ItineraryFormData>
  ) {
    setFormData(previous => ({
      ...previous,
      ...changes,
    }));
  }

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

  const [formData, setFormData] = useState<ItineraryFormData>({
    barrioInicio: null,
    puntoInicio: null,

    cantidadDias: 1,
    disponibilidadDiaria: "diaCompleto",
    modalidadViaje: "",
    categoriasPrioritarias: [],
    ritmo: "",
    presupuesto: "",
  });

  function renderCurrentStep() {
    switch (currentStepCounter) {
      case 0:
        return (
          <LocationStep
            barrioInicio={formData.barrioInicio}
            puntoInicio={formData.puntoInicio}
            onChange={(changes) => updateFormData(changes)}
          />
        );

      case 1:
        return (
          <DurationStep
            cantidadDias={formData.cantidadDias}
            disponibilidadDiaria={formData.disponibilidadDiaria}
            onChange={(changes) => updateFormData(changes)}
          />
        );

      
      default:
        return null;
      }
    }
  return (
    <>
    <main className="planificacion-form-main">
      <StepIndicator 
        currentStep={currentStepCounter}
        stepLabel={currentStep.label}
        totalSteps={steps.length}
      />
      
      <div className="planificacion-step-content">
        {renderCurrentStep()}
      </div>

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