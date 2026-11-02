import { useCallback, useEffect, useState } from "react";
import { Modal } from "../../../components/Modal";
import { VerticalTabs, type TabItem } from "../../../components/VerticalTabs";
import { StatusBar, type SaveStatus } from "../../../components/StatusBar";

// API and Types
import { actualizarPreferencias, actualizarRestricciones, getPerfil } from "../api/perfil";
import type { PerfilUsuarioDTO, RitmoVisita, TipoDieta, TipoTransporte } from "../types";

// Tab Components
import { ProfileInfoTab } from "./ProfileInfoTab";
import { PreferencesTab } from "./PreferencesTab";
import { RestrictionsTab } from "./RestrictionsTab";

import "./ProfileModal.css";

export interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = "perfil" | "preferencias" | "restricciones";

const TAB_ITEMS: TabItem<TabType>[] = [
  {
    id: "perfil",
    label: "Perfil",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    )
  },
  {
    id: "preferencias",
    label: "Preferencias",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    )
  },
  {
    id: "restricciones",
    label: "Restricciones",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    )
  }
];

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("perfil");
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

  useEffect(() => {
    if (isOpen) {
      void loadPerfil();
      setActiveTab("perfil");
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

  const handleRitmoChange = async (ritmo: RitmoVisita) => {
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

  const handleTransporteToggle = async (transporte: TipoTransporte) => {
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

  const handleDietaToggle = async (dieta: TipoDieta) => {
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

  const handleAccesibilidadToggle = async (
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Configuración de Cuenta" size="xl" className="profile-modal">
      <div className="profile-panel">
        <VerticalTabs 
          tabs={TAB_ITEMS} 
          activeTab={activeTab} 
          onChange={setActiveTab} 
          ariaLabel="Secciones del perfil" 
        />

        <main className="profile-content">
          <StatusBar status={saveStatus} feedbackMessage={feedbackMessage} />

          {isLoading ? (
            <div className="profile-loading">
              <div className="skeleton profile-loading__avatar" />
              <div className="skeleton profile-loading__line" />
              <div className="skeleton profile-loading__line profile-loading__line--short" />
            </div>
          ) : error || !perfil ? (
            <div className="profile-error">
              <p>{error ?? "Ocurrió un error al cargar el perfil."}</p>
              <button type="button" className="profile-retry-btn" onClick={() => void loadPerfil()}>Reintentar</button>
            </div>
          ) : (
            <>
              {activeTab === "perfil" && <ProfileInfoTab perfil={perfil} />}
              {activeTab === "preferencias" && (
                <PreferencesTab 
                  preferencias={perfil.preferencias} 
                  onRitmoChange={handleRitmoChange} 
                  onTransporteToggle={handleTransporteToggle} 
                />
              )}
              {activeTab === "restricciones" && (
                <RestrictionsTab 
                  restricciones={perfil.restricciones} 
                  onDietaToggle={handleDietaToggle} 
                  onAccesibilidadToggle={handleAccesibilidadToggle} 
                />
              )}
            </>
          )}
        </main>
      </div>
    </Modal>
  );
}