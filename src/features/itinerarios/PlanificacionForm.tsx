import { useEffect, useRef, useState } from "react";
import StepIndicator from "./StepIndicator";
import DurationStep from "./steps/DurationStep";
import LocationStep from "./steps/LocationStep";
import TravelCompanionsAndInterestsStep from "./steps/TravelCompanionsAndInterestsStep";
import TravelStyleStep from "./steps/TravelStyleStep";
import PlanificacionFormNavigation from "./PlanificacionFormNavigation";

import "./PlanificacionForm.css"
import type { BarrioCaba, CategoriaDto } from "../../api/types";
import type { DisponibilidadDiaria, ModalidadViaje, PuntoInicio, RitmoCaminata } from "./types";
import { getCategorias } from "../../api/lugares";
import type { TipoTransporte } from "../profile/types";
import { validateStep, type FormErrors } from "./PlanificationForm.validation";
import type { NivelPresupuesto, ViajeCreateDto } from "../viaje/types";
import { createViaje } from "../viaje/api/viajes";
import { toDateOnlyString } from "../../lib/format";

export interface ItineraryFormData {
  barrio: BarrioCaba | null;
  puntoInicio: PuntoInicio | null;
  hospedajeLugarGuid: string | null;
  hospedajeBarrio: BarrioCaba | null;

  cantidadDias: number | null;
  disponibilidadDiaria: DisponibilidadDiaria | null;

  modalidadViaje: ModalidadViaje | null;

  categoriasPrioritarias: CategoriaDto[];

  ritmoVisita: RitmoCaminata | null;
  presupuestoNivel: NivelPresupuesto | null;
  tipoTransporte: TipoTransporte | null;
}

type NavigationDirection = "forward" | "backward";
function PlanificacionForm() {
  const [errors, setErrors] = useState<FormErrors>({});
  const [currentStepCounter, setCurrentStepCounter] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false)
  const formRef = useRef<HTMLElement | null>(null)

  const [direction, setDirection] = useState<NavigationDirection>("forward");

  function scrollToFormTop() {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

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
    scrollToFormTop()

    const validationErrors = validateStep(formData, currentStepCounter)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      return
    }
    setDirection("forward");
    setCurrentStepCounter(prev => {
      if (prev >= steps.length-1) return prev
      return prev + 1
    })

    // paso final = submit
    if (currentStepCounter >= steps.length-1) {
      handleSubmit();
    }
  }

  async function handleSubmit() {
    setSubmitLoading(true)
    // temporary solution to DTO mismatch
    const hoy = new Date();
    const fechaFin = new Date(hoy);
    fechaFin.setDate(hoy.getDate() + Number(formData.cantidadDias! -1));

    const viajeCreateDto: ViajeCreateDto = {
      barrio: formData.barrio!,
      tipoViaje: formData.modalidadViaje!,
      titulo: "Temp title",
      alcanceTemporal: formData.disponibilidadDiaria!,
      fechaInicio: toDateOnlyString(hoy),
      fechaFin: toDateOnlyString(fechaFin),
      nivelPresupuesto: formData.presupuestoNivel!,
      ritmoCaminata: formData.ritmoVisita!,
      tipoPuntoPartida: formData.puntoInicio!,
      categoriaCodigos: formData.categoriasPrioritarias.map(x => x.codigo),
      lugarPartidaId: formData.hospedajeLugarGuid!
    }
    console.log(viajeCreateDto)
    try {
      const viajeResponse = await createViaje(viajeCreateDto);
      const viajeId = viajeResponse.id;
      navigation.navigate(`/viajes/${viajeId}`)
    } finally {
      setSubmitLoading(false)
    }
  }

  function handleBack() {
    setErrors({}) // clear errors

    if (currentStepCounter <= 0) {
      navigation.navigate("/")
      return
    }

    scrollToFormTop()
    setDirection("backward");
    setCurrentStepCounter(prev => {
      if (prev <= 0) return prev
      return prev - 1
    })
  }

  const [categorias, setCategorias] = useState<CategoriaDto[]>([])
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        setCategorias(await getCategorias())
      } catch {
        // Ignore error
      }
    }
    fetchCategorias()
  }, [])
  

  const [formData, setFormData] = useState<ItineraryFormData>({
    barrio: null,
    puntoInicio: null,
    hospedajeLugarGuid: null,
    hospedajeBarrio: null,

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
            barrio={formData.barrio}
            puntoInicio={formData.puntoInicio}
            hospedajeLugarGuid={formData.hospedajeLugarGuid}
            hospedajeBarrio={formData.hospedajeBarrio}
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
            onChange={(changes) => {
              if (changes.categoriasPrioritarias && changes.categoriasPrioritarias?.length >= 4) {
                const prevErrors = errors
                const validationErrors = validateStep({...formData, ...changes}, currentStepCounter)
                setErrors({... prevErrors, categoriasPrioritarias: validationErrors.categoriasPrioritarias})
              } 
              updateFormData(changes)

            }}
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
    <main className="planificacion-form-main" ref={formRef}>
      <StepIndicator 
        currentStep={currentStepCounter}
        stepLabel={currentStep.label}
        totalSteps={steps.length}
      />
      
      <div 
        key={currentStepCounter}
        className={`planificacion-step-content planificacion-step-content--${direction}`}
      >
        {renderCurrentStep()}
      </div>

      <PlanificacionFormNavigation 
        onBack={handleBack}
        onNext={handleNext}
        isFirstStep={currentStepCounter === 0}
        isLastStep={currentStepCounter === steps.length - 1}
        isSubmitLoading={submitLoading}
      />

    </main>
    </>
    );
}
export default PlanificacionForm