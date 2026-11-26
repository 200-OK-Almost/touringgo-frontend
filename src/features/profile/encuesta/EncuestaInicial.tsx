import { useEffect, useState } from "react";
import StepIndicator from "../../itinerarios/StepIndicator"
import RestriccionesStep from "./RestriccionesStep";
import type { ActualizarPreferenciasCategoriaDTO, ActualizarPreferenciasUsuarioDTO, PreferenciasCategoriaDTO, TipoDieta } from "../types";
import { useNavigate } from "react-router-dom";
import PreferenciasStep from "./PreferenciasStep";
import { actualizarPreferencias, completarEncuesta, getPerfil } from "../api/perfil";
import FormNavigation from "../../../components/FormNavigation";

type EncuestaFormData = {
  requiereRecorridoSinEscalones: boolean
  requiereBanoAccesible: boolean
  tipoDietas: TipoDieta[]
  preferenciasCategorias: PreferenciasCategoriaDTO[]
}

const PASOS = [
  { label: "Restricciones" },
  { label: "Preferencias e intereses" }
];

type NavigationDirection = "forward" | "backward";

function EncuestaInicial() {
  const [formData, setFormData] = useState<EncuestaFormData>({
    requiereRecorridoSinEscalones: false,
    requiereBanoAccesible: false,
    tipoDietas: [],
    preferenciasCategorias: []
  })
  const [currentStepCounter, setCurrentStepCounter] = useState(0)
  const currentStep = PASOS[currentStepCounter]
  const navigate = useNavigate();
  const [direction, setDirection] = useState<NavigationDirection>("forward");
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const perfil = await getPerfil()
        setFormData((prev) => ({
          ...prev,
          preferenciasCategorias: perfil.preferencias.categorias,
        }));
      } catch {
        // Ignore error
      }
    };

    fetchPerfil();
  }, []);

  const handleAfinidadChange = (categoriaCodigo: string, afinidad: number) => {
    setFormData((prev) => ({
      ...prev,
      preferenciasCategorias: prev.preferenciasCategorias.map((item) =>
        item.categoriaCodigo === categoriaCodigo
          ? { ...item, afinidad }
          : item
      ),
    }));
  };

  function updateFormData(changes: Partial<EncuestaFormData>) {
    setFormData((prev) => {
      const next = {
        ...prev,
        ...changes,
      };

      return next;
    });
  }

  function renderCurrentStep() {
    switch (currentStepCounter) {
      case 0:
        return (
          <RestriccionesStep
            requiereRecorridoSinEscalones={formData.requiereRecorridoSinEscalones}
            requiereBanoAccesible={formData.requiereBanoAccesible}
            tipoDietas={formData.tipoDietas}
            onChange={(changes) => updateFormData(changes)}
          />
        );
      case 1:
        return (
          <PreferenciasStep
            preferenciasCategorias={formData.preferenciasCategorias}
            onAfinidadChange={handleAfinidadChange}
          />
        );


      default:
        return null;
    }
  }

  function handleBack() {
    if (currentStepCounter <= 0) {
      navigate("/");
      return;
    }

    setDirection("backward");
    setCurrentStepCounter((prev) => {
      if (prev <= 0) return prev;
      return prev - 1;
    });
  }

  function handleNext() {
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
    try {

      await completarEncuesta()
    } catch {
      
    }
  }

  return (
    <main className="planificacion-form-main">
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

      <FormNavigation
        onBack={handleBack}
        onNext={handleNext}
        isFirstStep={currentStepCounter === 0}
        isLastStep={currentStepCounter === PASOS.length - 1}
        lastStepButtonLabel="Finalizar"
        lastStepButtonLabelLoading="Cargando..."
        isSubmitLoading={submitLoading}
      />
    </main>
  )
}
export default EncuestaInicial