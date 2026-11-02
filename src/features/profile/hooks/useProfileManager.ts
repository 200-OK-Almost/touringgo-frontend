import { useState, useCallback, useEffect } from "react";
import { actualizarPreferencias, actualizarRestricciones, getPerfil } from "../api/perfil";
import type { PerfilUsuarioDTO, RitmoVisita, TipoDieta, TipoTransporte } from "../types";
import type { SaveStatus } from "../../../components/StatusBar";

export function useProfileManager(isOpen: boolean) {
  const [perfil, setPerfil] = useState<PerfilUsuarioDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const loadPerfil = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getPerfil();
      setPerfil(data);
    } catch {
      setError("No se pudo cargar la información del perfil.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch data when modal opens
  useEffect(() => {
    if (isOpen) {
      void loadPerfil();
      setSaveStatus("idle");
      setFeedbackMessage(null);
    }
  }, [isOpen, loadPerfil]);

  const notifySaved = () => {
    setSaveStatus("saved");
    setTimeout(() => {
      setSaveStatus((prev) => (prev === "saved" ? "idle" : prev));
    }, 2500);
  };

  const updateRitmo = async (ritmo: RitmoVisita) => {
    if (!perfil || perfil.preferencias.ritmoVisitaPreferido === ritmo) return;
    const prevPerfil = perfil;
    setPerfil({ ...perfil, preferencias: { ...perfil.preferencias, ritmoVisitaPreferido: ritmo } });
    
    setSaveStatus("saving");
    try {
      await actualizarPreferencias({ ritmoVisitaPreferido: ritmo });
      notifySaved();
    } catch {
      setPerfil(prevPerfil);
      setSaveStatus("error");
      setFeedbackMessage("No se pudo guardar el ritmo de visita.");
    }
  };

  const toggleTransporte = async (transporte: TipoTransporte) => {
    if (!perfil) return;
    const actuales = perfil.preferencias.transportesPreferidos;
    const exists = actuales.includes(transporte);

    if (exists && actuales.length === 1) {
      setFeedbackMessage("Debes mantener al menos un medio de transporte seleccionado.");
      setTimeout(() => setFeedbackMessage(null), 3000);
      return;
    }

    const nuevos = exists ? actuales.filter((t) => t !== transporte) : [...actuales, transporte];
    const prevPerfil = perfil;
    setPerfil({ ...perfil, preferencias: { ...perfil.preferencias, transportesPreferidos: nuevos } });

    setSaveStatus("saving");
    try {
      await actualizarPreferencias({ transportesPreferidos: nuevos });
      notifySaved();
    } catch {
      setPerfil(prevPerfil);
      setSaveStatus("error");
      setFeedbackMessage("No se pudieron guardar los medios de transporte.");
    }
  };

  const toggleDieta = async (dieta: TipoDieta) => {
    if (!perfil) return;
    const actuales = perfil.restricciones.dieta;
    const nuevas = actuales.includes(dieta) ? actuales.filter((d) => d !== dieta) : [...actuales, dieta];
    const prevPerfil = perfil;
    
    setPerfil({ ...perfil, restricciones: { ...perfil.restricciones, dieta: nuevas } });

    setSaveStatus("saving");
    try {
      await actualizarRestricciones({ dieta: nuevas });
      notifySaved();
    } catch {
      setPerfil(prevPerfil);
      setSaveStatus("error");
      setFeedbackMessage("No se pudieron guardar las restricciones dietarias.");
    }
  };

  const toggleAccesibilidad = async (
    campo: "requiereBanoAccesible" | "requiereRecorridoSinEscalones",
    valor: boolean
  ) => {
    if (!perfil) return;
    const prevPerfil = perfil;
    setPerfil({ ...perfil, restricciones: { ...perfil.restricciones, [campo]: valor } });

    setSaveStatus("saving");
    try {
      await actualizarRestricciones({ [campo]: valor });
      notifySaved();
    } catch {
      setPerfil(prevPerfil);
      setSaveStatus("error");
      setFeedbackMessage("No se pudo guardar la opción de accesibilidad.");
    }
  };

  return {
    perfil,
    isLoading,
    error,
    saveStatus,
    feedbackMessage,
    loadPerfil,
    updateRitmo,
    toggleTransporte,
    toggleDieta,
    toggleAccesibilidad,
  };
}