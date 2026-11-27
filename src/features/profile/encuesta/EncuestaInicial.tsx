import { useEffect, useState } from "react";
import StepIndicator from "../../itinerarios/StepIndicator"
import RestriccionesStep from "./RestriccionesStep";
import type { ActualizarPerfilUsuarioDTO, PerfilUsuarioDTO, PreferenciasCategoriaDTO, TipoDieta } from "../types";
import { useNavigate } from "react-router-dom";
import PreferenciasStep from "./PreferenciasStep";
import { actualizarPerfil, completarEncuesta, getPerfil } from "../api/perfil";
import FormNavigation from "../../../components/FormNavigation";
import EncuestaBienvenida from "./EncuestaBienvenida";
import "./EncuestaInicial.css"
import { useAuth } from "../../auth/auth-context";

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
  const { checkAuth } = useAuth();
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
  const [perfil, setPerfil] = useState<PerfilUsuarioDTO | null>(null)
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const perfilData = await getPerfil()
        setFormData({
          requiereRecorridoSinEscalones:
            perfilData.restricciones.requiereRecorridoSinEscalones,

          requiereBanoAccesible:
            perfilData.restricciones.requiereBanoAccesible,

          tipoDietas: [...perfilData.restricciones.dieta],

          preferenciasCategorias: perfilData.preferencias.categorias
        });
        setPerfil(perfilData)
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
    if (currentStepCounter === 0) {
      setStarted(false);
      return;
    }

    setDirection("backward");
    setCurrentStepCounter(prev => prev - 1);
  }

  function handleNext() {
    if (currentStepCounter >= PASOS.length - 1) {
      void handleSubmit();
      return;
    }

    setDirection("forward");
    setCurrentStepCounter(prev => prev + 1);
  }

  async function handleSubmit() {
    if (!perfil || submitLoading) return;

    const dto: ActualizarPerfilUsuarioDTO = {
      preferencias: {
        ritmoVisitaPreferido: perfil.preferencias.ritmoVisitaPreferido,
        transportesPreferidos: perfil.preferencias.transportesPreferidos,
        categorias: formData.preferenciasCategorias.map(
          ({ categoriaCodigo, afinidad }) => ({
            categoriaCodigo,
            afinidad
          })
        )
      },
      restricciones: {
        dieta: formData.tipoDietas,
        requiereRecorridoSinEscalones: formData.requiereRecorridoSinEscalones,
        requiereBanoAccesible: formData.requiereBanoAccesible
      }
    };

    try {
      setSubmitLoading(true);

      await actualizarPerfil(dto);
      await completarEncuesta();

      await checkAuth() // refrescar para habilitar botons de navbar

      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error al completar la encuesta:", error);
      // Mostrar un mensaje de error en el formulario.
    } finally {
      setSubmitLoading(false);
    }
  }

  return (
    <main className="planificacion-form-main">
      {!started ? (
        <EncuestaBienvenida onStart={() => setStarted(true)} />
      ) : (
      <>
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
      </>
      )}
    </main>
  )
}
export default EncuestaInicial