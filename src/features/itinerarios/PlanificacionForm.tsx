import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import StepIndicator from "./StepIndicator";
import DurationStep from "./steps/DurationStep";
import LocationStep from "./steps/LocationStep";
import TravelCompanionsAndInterestsStep from "./steps/TravelCompanionsAndInterestsStep";
import TravelStyleStep from "./steps/TravelStyleStep";
import PlanificacionFormNavigation from "./PlanificacionFormNavigation";

import "./PlanificacionForm.css"
import type { CategoriaDto } from "../../api/types";
import { getCategorias } from "../../api/lugares";
import { validateStep, type FormErrors } from "./PlanificationForm.validation";
import type { ViajeCreateDto } from "../viaje/types";
import { createViaje } from "../viaje/api/viajes";
import {
  crearItineraryFormDataInicial,
  type DiaPlanificacion,
  type ItineraryFormData,
} from "./planificacionFormData";
import { usePlanificacionDraft } from "./hooks/usePlanificacionDraft";
import { barrioLabel } from "../../lib/format";
import { construirDias } from "./lib/diasPlanificacion";

const PASOS = [
  { label: "Duración y disponibilidad diaria" },
  { label: "Barrio y punto de partida" },
  { label: "Compañía e Intereses" },
  { label: "Estilo" },
];

type NavigationDirection = "forward" | "backward";

function PlanificacionForm() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const reiniciar = searchParams.get("nuevo") === "1";
  const { draft, saveDraft, clearDraft } = usePlanificacionDraft();

  const [errors, setErrors] = useState<FormErrors>({});
  const [currentStepCounter, setCurrentStepCounter] = useState(() => {
    const paso = reiniciar ? 0 : draft?.currentStepCounter ?? 0;
    return Math.min(Math.max(paso, 0), PASOS.length - 1);
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const formRef = useRef<HTMLElement | null>(null);
  const [direction, setDirection] = useState<NavigationDirection>("forward");
  const [categorias, setCategorias] = useState<CategoriaDto[]>([]);
  const [formData, setFormData] = useState<ItineraryFormData>(() =>
    reiniciar
      ? crearItineraryFormDataInicial()
      : draft?.formData ?? crearItineraryFormDataInicial()
  );

  const currentStep = PASOS[currentStepCounter] ?? PASOS[0];

  const reiniciarWizard = useCallback(() => {
    setFormData(crearItineraryFormDataInicial());
    setCurrentStepCounter(0);
    setErrors({});
    setDirection("forward");
  }, []);

  useEffect(() => {
    if (!reiniciar) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect -- reinicio explícito desde Nuevo viaje
    reiniciarWizard();
    clearDraft();
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [reiniciar, clearDraft, setSearchParams, reiniciarWizard]);

  useEffect(() => {
    saveDraft(formData, currentStepCounter);
  }, [formData, currentStepCounter, saveDraft]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        setCategorias(await getCategorias());
      } catch {
        // Ignore error
      }
    };

    fetchCategorias();
  }, []);

  function scrollToFormTop() {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function updateFormData(changes: Partial<ItineraryFormData>) {
    setFormData((prev) => {
      const next = {
        ...prev,
        ...changes,
      };

      if ("fechaInicio" in changes || "fechaFin" in changes) {
        const dias = construirDias(next.fechaInicio, next.fechaFin, prev.dias);

        return {
          ...next,
          dias,
          duracion: dias.length,
        };
      }

      return next;
    });
  }

  function updateDia(diaNumero: number, changes: Partial<DiaPlanificacion>) {
    setFormData((prev) => ({
      ...prev,
      dias: prev.dias.map((dia) =>
        dia.dia === diaNumero ? { ...dia, ...changes } : dia
      ),
    }));
  }

  function handleNext() {
    scrollToFormTop();

    const validationErrors = validateStep(formData, currentStepCounter);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setDirection("forward");
    setCurrentStepCounter((prev) => {
      if (prev >= PASOS.length - 1) return prev;
      return prev + 1;
    });

    if (currentStepCounter >= PASOS.length - 1) {
      handleSubmit();
    }
  }

  async function handleSubmit() {
    setSubmitLoading(true);
    const primerDia = formData.dias[0];
    const titulo = `Salida por ${barrioLabel(primerDia.barrio!)}`

    const viajeCreateDto: ViajeCreateDto = {
      barrio: primerDia.barrio!,
      tipoViaje: formData.modalidadViaje!,
      titulo: titulo,
      alcanceTemporal: formData.disponibilidadDiaria!,
      fechaInicio: formData.fechaInicio!,
      fechaFin: formData.fechaFin!,
      nivelPresupuesto: formData.presupuestoNivel!,
      ritmoCaminata: formData.ritmoVisita!,
      tipoPuntoPartida: primerDia.puntoInicio!,
      categoriaCodigos: formData.categoriasPrioritarias.map(x => x.codigo),
      lugarPartidaId: primerDia.hospedajeLugarGuid ?? undefined
    }
    
    try {
      const viajeResponse = await createViaje(viajeCreateDto);
      clearDraft();
      navigate(`/viajes/${viajeResponse.id}`);
    } finally {
      setSubmitLoading(false);
    }
  }

  function handleBack() {
    setErrors({});

    if (currentStepCounter <= 0) {
      navigate("/");
      return;
    }

    scrollToFormTop();
    setDirection("backward");
    setCurrentStepCounter((prev) => {
      if (prev <= 0) return prev;
      return prev - 1;
    });
  }

  function renderCurrentStep() {
    switch (currentStepCounter) {
      case 0:
        return (
          <DurationStep
            fechaInicio={formData.fechaInicio}
            fechaFin={formData.fechaFin}
            disponibilidadDiaria={formData.disponibilidadDiaria}
            onChange={(changes) => updateFormData(changes)}
            errors={errors}
          />
        );

      case 1:
        return (
          <LocationStep
            barrio={formData.dias[0]?.barrio ?? null}
            puntoInicio={formData.dias[0]?.puntoInicio ?? null}
            hospedajeLugarGuid={formData.dias[0]?.hospedajeLugarGuid ?? null}
            hospedajeBarrio={formData.dias[0]?.hospedajeBarrio ?? null}
            onChange={(changes) => updateDia(1, changes)}
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
              if (changes.categoriasPrioritarias && changes.categoriasPrioritarias.length >= 4) {
                const prevErrors = errors;
                const validationErrors = validateStep(
                  { ...formData, ...changes },
                  currentStepCounter
                );
                setErrors({
                  ...prevErrors,
                  categoriasPrioritarias: validationErrors.categoriasPrioritarias,
                });
              }
              updateFormData(changes);
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
    <main className="planificacion-form-main" ref={formRef}>
      <StepIndicator
        currentStep={currentStepCounter}
        stepLabel={currentStep.label}
        totalSteps={PASOS.length}
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
        isLastStep={currentStepCounter === PASOS.length - 1}
        isSubmitLoading={submitLoading}
      />
    </main>
  );
}

export default PlanificacionForm;
