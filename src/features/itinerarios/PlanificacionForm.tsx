import { useEffect, useState } from "react";
import StepIndicator from "./StepIndicator";
import DurationStep from "./steps/DurationStep";
import LocationStep from "./steps/LocationStep";
import TravelCompanionsAndInterestsStep from "./steps/TravelCompanionsAndInterestsStep";
import TravelStyleStep from "./steps/TravelStyleStep";
import PlanificacionFormNavigation from "./PlanificacionFormNavigation";

import "./PlanificacionForm.css"
import type { BarrioCaba, CategoriaDto } from "../../api/types";
import type { DisponibilidadDiaria, ModalidadViaje, PuntoInicio } from "./types";
import { getCategorias } from "../../api/lugares";
import type { RitmoVisita } from "../profile/types";

export interface ItineraryFormData {
  barrioInicio: BarrioCaba | null;
  puntoInicio: PuntoInicio | null;
  hospedajeDireccion?: string | null;

  cantidadDias: number | null;
  disponibilidadDiaria: DisponibilidadDiaria;

  modalidadViaje: ModalidadViaje | null;

  categoriasPrioritarias: CategoriaDto[];

  ritmoVisita: RitmoVisita | null;
  presupuestoNivel: number | null;
}

function PlanificacionForm() {
  const [currentStepCounter, setCurrentStepCounter] = useState(0);

  const steps = [
    { label: "Barrio y punto de partida", Component: LocationStep },
    { label: "Duración y disponibilidad diaria", Component: DurationStep },
    { label: "Compañía e Intereses", Component: TravelCompanionsAndInterestsStep },
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

  const [categorias, setCategorias] = useState<CategoriaDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        setIsLoading(true);
        setCategorias(await getCategorias())
      } finally {
        setIsLoading(false)
      }
    }
    fetchCategorias()
  }, [])
  

  const [formData, setFormData] = useState<ItineraryFormData>({
    barrioInicio: null,
    puntoInicio: null,

    cantidadDias: 1,
    disponibilidadDiaria: "diaCompleto",
    modalidadViaje: null,
    categoriasPrioritarias: [],
    ritmoVisita: null,
    presupuestoNivel: null,
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

      case 2:
        return (
          <TravelCompanionsAndInterestsStep
            categorias={categorias}
            modalidadViaje={formData.modalidadViaje}
            categoriasPrioritarias={formData.categoriasPrioritarias}
            onChange={(changes) => updateFormData(changes)}
          />
        );

      case 3:
        return (
          <TravelStyleStep
            ritmoVisita={formData.ritmoVisita}
            presupuestoNivel={formData.presupuestoNivel}
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