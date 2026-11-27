import { useState } from "react";
import { Modal } from "../../../components/Modal";
import { VerticalTabs, type TabItem } from "../../../components/VerticalTabs";
import { StatusBar } from "../../../components/StatusBar";

// Tab Components
import { ProfileInfoTab } from "./ProfileInfoTab";
import { PreferencesTab } from "./PreferencesTab";
import { RestrictionsTab } from "./RestrictionsTab";
import { InterestsTab } from "./InterestsTab";

import "./ProfileModal.css";
import { useProfileManager } from "../hooks/useProfileManager";

export interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = "perfil" | "preferencias" | "restricciones" | "intereses";

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
  },
  {
    id: "intereses",
    label: "Intereses",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path d="M352.92 80C288 80 256 144 256 144s-32-64-96.92-64c-52.76 0-94.54 44.14-95.08 96.81-1.1 109.33 86.73 187.08 183 252.42a16 16 0 0 0 18 0c96.26-65.34 184.09-143.09 183-252.42-.54-52.67-42.32-96.81-95.08-96.81" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" strokeWidth="32px"/>
      </svg>
    )
  },
];

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("perfil");
  const {
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
    updateCategoriaAfinidadLocal,
    updateCategoriaAfinidadEnd,
  } = useProfileManager(isOpen);

  // Reiniciar la pestaña a "perfil" cuando se cierra el modal
  const handleClose = () => {
    onClose();
    setTimeout(() => setActiveTab("perfil"), 300); // Espera a la animación de cierre
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Configuración de Cuenta" size="xl" className="profile-modal">
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
              <button type="button" className="profile-retry-btn" onClick={() => void loadPerfil()}>
                Reintentar
              </button>
            </div>
          ) : (
            <>
              {activeTab === "perfil" && (
                <ProfileInfoTab perfil={perfil} />
              )}
              {activeTab === "preferencias" && (
                <PreferencesTab 
                  preferencias={perfil.preferencias} 
                  onRitmoChange={updateRitmo} 
                  onTransporteToggle={toggleTransporte} 
                />
              )}
              {activeTab === "restricciones" && (
                <RestrictionsTab 
                  restricciones={perfil.restricciones} 
                  onDietaToggle={toggleDieta} 
                  onAccesibilidadToggle={toggleAccesibilidad} 
                />
              )}
              {activeTab === "intereses" && (
                <InterestsTab 
                  preferenciasCategorias={perfil.preferencias.categorias}
                  onAfinidadChange={updateCategoriaAfinidadLocal}
                  onAfinidadChangeEnd={updateCategoriaAfinidadEnd}
                />
              )}
            </>
          )}
        </main>
      </div>
    </Modal>
  );
}
