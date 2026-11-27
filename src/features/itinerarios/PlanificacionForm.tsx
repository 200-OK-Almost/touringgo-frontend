import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import StepIndicator from "./StepIndicator";
import DurationStep from "./steps/DurationStep";
import LocationStep from "./steps/LocationStep";
import InteresesYEstiloStep from "./steps/InteresesYEstiloStep";
import PlanificacionFormNavigation from "./PlanificacionFormNavigation";
import PlanificacionErrorSummary from "./components/PlanificacionErrorSummary";
import ResumenPlanificacion from "./components/ResumenPlanificacion";

import "./PlanificacionForm.css"
import type { CategoriaDto } from "../../api/types";
import { getCategorias } from "../../api/lugares";
import { validateStep, type FormErrors } from "./PlanificationForm.validation";
import { createViaje } from "../viaje/api/viajes";
import {
  crearItineraryFormDataInicial,
  type DiaPlanificacion,
  type ItineraryFormData,
} from "./planificacionFormData";
import { usePlanificacionDraft } from "./hooks/usePlanificacionDraft";
import { construirDias } from "./lib/diasPlanificacion";
import { construirViajeCreateDto } from "./lib/viajePayload";
import { crearMensajeErrorEnvio } from "./lib/erroresEnvio";
import {
  leerTemaPlanificacion,
  type TemaPlanificacion,
} from "./lib/temaPlanificacion";

const PASOS = [
  { label: "Fechas y duración", shortLabel: "Fechas" },
  { label: "Barrio y punto de partida", shortLabel: "Barrio" },
  { label: "Intereses y estilo", shortLabel: "Intereses y estilo" },
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
  const [submitError, setSubmitError] = useState<string | null>(null);
  const formRef = useRef<HTMLElement | null>(null);
  const errorSummaryRef = useRef<HTMLDivElement | null>(null);
  const submitErrorRef = useRef<HTMLDivElement | null>(null);
  const isFirstRenderRef = useRef(true);
  const temaAplicadoRef = useRef(false);
  const [direction, setDirection] = useState<NavigationDirection>("forward");
  const [categorias, setCategorias] = useState<CategoriaDto[]>([]);
  const [categoriasCargadas, setCategoriasCargadas] = useState(false);
  const [temaInicial] = useState<TemaPlanificacion | null>(() =>
    leerTemaPlanificacion(searchParams)
  );
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
    if (Object.keys(errors).length === 0) {
      return;
    }

    errorSummaryRef.current?.focus();
  }, [errors]);

  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }

    document
      .getElementById("planificacion-step-title")
      ?.focus({ preventScroll: true });
  }, [currentStepCounter]);

  useEffect(() => {
    if (!submitError) {
      return;
    }

    submitErrorRef.current?.focus();
  }, [submitError]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        setCategorias(await getCategorias());
      } catch {
        // Ignore error
      } finally {
        setCategoriasCargadas(true);
      }
    };

    fetchCategorias();
  }, []);

  useEffect(() => {
    if (!temaInicial || temaAplicadoRef.current) {
      return;
    }

    if (formData.dias.length === 0) {
      return;
    }

    if (temaInicial.categoriaCodigo && !categoriasCargadas) {
      return;
    }

    const categoria = temaInicial.categoriaCodigo
      ? categorias.find((item) => item.codigo === temaInicial.categoriaCodigo) ?? null
      : null;

    temaAplicadoRef.current = true;

    // eslint-disable-next-line react-hooks/set-state-in-effect -- precarga explícita desde un recorrido
    setFormData((prev) => ({
      ...prev,
      dias: prev.dias.map((dia) => ({
        ...dia,
        barrio: dia.barrio ?? temaInicial.barrio,
        categoriasPrioritarias:
          dia.categoriasPrioritarias.length > 0 || !categoria
            ? dia.categoriasPrioritarias
            : [categoria],
      })),
    }));
  }, [temaInicial, categoriasCargadas, categorias, formData.dias]);

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
    const validationErrors = validateStep(formData, currentStepCounter);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    scrollToFormTop();
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
    if (submitLoading) {
      return;
    }

    setSubmitLoading(true);
    setSubmitError(null);

    try {
      const viajeCreateDto = construirViajeCreateDto(formData);
      const viajeResponse = await createViaje(viajeCreateDto);
      clearDraft();
      navigate(`/viajes/${viajeResponse.id}`);
    } catch (error) {
      setSubmitError(crearMensajeErrorEnvio(error));
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

  function handleStepSelect(step: number) {
    if (step < 0 || step >= currentStepCounter) {
      return;
    }

    setErrors({});
    setSubmitError(null);
    scrollToFormTop();
    setDirection("backward");
    setCurrentStepCounter(step);
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
            dias={formData.dias}
            onChangeDia={updateDia}
            errors={errors}
          />
        );

      case 2:
        return (
          <InteresesYEstiloStep
            categorias={categorias}
            dias={formData.dias}
            onChangeDia={updateDia}
            errors={errors}
          />
        );

      default:
        return null;
    }
  }

  return (
    <main className="planificacion-form-main" ref={formRef}>
      <header className="planificacion-form-heading">
        <h1 className="planificacion-form-title">Planificá tu salida</h1>
        <p className="planificacion-form-description text-muted">
          Contanos tus preferencias y armamos un itinerario a tu medida.
        </p>
      </header>

      <StepIndicator
        currentStep={currentStepCounter}
        stepLabel={currentStep.label}
        totalSteps={PASOS.length}
        steps={PASOS}
        onStepSelect={handleStepSelect}
      />

      <PlanificacionErrorSummary ref={errorSummaryRef} errors={errors} />

      <div
        key={currentStepCounter}
        className={`planificacion-step-content planificacion-step-content--${direction}`}
      >
        {renderCurrentStep()}
      </div>

      {submitError && (
        <div
          ref={submitErrorRef}
          className="planificacion-submit-error"
          role="alert"
          tabIndex={-1}
        >
          <p>{submitError}</p>
          <button
            type="button"
            className="planificacion-submit-error__retry"
            onClick={handleSubmit}
            disabled={submitLoading}
          >
            {submitLoading ? "Reintentando..." : "Reintentar"}
          </button>
        </div>
      )}

      <aside className="planificacion-form-resumen" aria-label="Resumen del viaje">
        <ResumenPlanificacion formData={formData} />
      </aside>

      <PlanificacionFormNavigation
        onBack={handleBack}
        onNext={handleNext}
        isFirstStep={currentStepCounter === 0}
        isLastStep={currentStepCounter === PASOS.length - 1}
        isSubmitLoading={submitLoading}
        nextLabel={PASOS[currentStepCounter + 1]?.label}
      />
    </main>
  );
}

export default PlanificacionForm;
