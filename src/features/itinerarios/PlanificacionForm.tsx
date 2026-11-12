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
import type { RitmoVisita, TipoTransporte } from "../profile/types";
import { validateStep, type FormErrors } from "./PlanificationForm.validation";

export interface ItineraryFormData {
  barrioInicio: BarrioCaba | null;
  puntoInicio: PuntoInicio | null;
  hospedajeDireccion?: string | null;

  cantidadDias: number | null;
  disponibilidadDiaria: DisponibilidadDiaria | null;

  modalidadViaje: ModalidadViaje | null;

  categoriasPrioritarias: CategoriaDto[];

  ritmoVisita: RitmoVisita | null;
  presupuestoNivel: number | null;
  tipoTransporte: TipoTransporte | null;
}

function PlanificacionForm() {
  const [errors, setErrors] = useState<FormErrors>({});
  
  const [currentStepCounter, setCurrentStepCounter] = useState(0);

  const steps = [
    { label: "Barrio y punto de partida" },
    { label: "Duración y disponibilidad diaria" },
    { label: "Compañía e Intereses" },
    { label: "Estilo" }
  ];

  const currentStep = steps[currentStepCounter];
  
  function updateFormData(changes: Partial<ItineraryFormData>) {    
    const newFormData = {
      ... formData,
      ... changes
    }
    setFormData(newFormData);
  }

  function handleNext() {
    const validationErrors = validateStep(formData, currentStepCounter)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    setCurrentStepCounter(prev => {
      if (prev >= steps.length-1) return prev
      return prev + 1
    })
  }
  function handleBack() {
    setErrors({}) // clear errors
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

    cantidadDias: null,
    disponibilidadDiaria: null,
    modalidadViaje: null,
    categoriasPrioritarias: [],
    ritmoVisita: null,
    tipoTransporte: null,
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
            errors={errors}
          />
        );

      case 1:
        return (
          <DurationStep
            cantidadDias={formData.cantidadDias}
            disponibilidadDiaria={formData.disponibilidadDiaria}
            onChange={(changes) => updateFormData(changes)}
            errors={errors}
          />
        );

      case 2:
        return (
          <TravelCompanionsAndInterestsStep
            categorias={categorias}
            modalidadViaje={formData.modalidadViaje}
            categoriasPrioritarias={formData.categoriasPrioritarias}
            onChange={(changes) => updateFormData(changes)}
            errors={errors}
          />
        );

      case 3:
        return (
          <TravelStyleStep
            ritmoVisita={formData.ritmoVisita}
            tipoTransporte={formData.tipoTransporte}
            presupuestoNivel={formData.presupuestoNivel}
            onChange={(changes) => updateFormData(changes)}
            errors={errors}
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