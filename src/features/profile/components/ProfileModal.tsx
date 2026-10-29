import { useCallback, useEffect, useState } from "react";
import { Modal } from "../../../components/Modal";
import { Avatar } from "../../../components/Avatar";
import {
  actualizarPreferencias,
  actualizarRestricciones,
  getPerfil,
} from "../api/perfil";
import type {
  PerfilUsuarioDTO,
  RitmoVisita,
  TipoDieta,
  TipoTransporte,
} from "../types";
import "./ProfileModal.css";

export interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = "perfil" | "preferencias" | "restricciones";

type SaveStatus = "idle" | "saving" | "saved" | "error";

const RITMO_OPCIONES: {
  id: RitmoVisita;
  label: string;
  descripcion: string;
  icon: string;
}[] = [
    {
      id: "Relajado",
      label: "Relajado",
      descripcion: "Pausado y contemplativo, con pocas paradas y más tiempo libre.",
      icon: "☕",
    },
    {
      id: "Moderado",
      label: "Moderado",
      descripcion: "Equilibrado entre descanso y actividades programadas.",
      icon: "🚶",
    },
    {
      id: "Activo",
      label: "Activo",
      descripcion: "Días intensos aprovechando al máximo cada atracción.",
      icon: "⚡",
    },
  ];

const TRANSPORTE_OPCIONES: {
  id: TipoTransporte;
  label: string;
  icon: string;
}[] = [
    { id: "Caminando", label: "Caminando (A pie)", icon: "👟" },
    { id: "TransportePublico", label: "Transporte público", icon: "🚌" },
    { id: "VehiculoPersonal", label: "Vehículo personal", icon: "🚗" },
  ];

const DIETA_OPCIONES: {
  id: TipoDieta;
  label: string;
}[] = [
    { id: "Celiaco", label: "Celíaco (Sin TACC)" },
    { id: "Vegetariano", label: "Vegetariano" },
    { id: "Vegano", label: "Vegano" },
    { id: "IntoleranteLactosa", label: "Intolerante a la lactosa" },
  ];

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("perfil");
  const [perfil, setPerfil] = useState<PerfilUsuarioDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Cargar perfil completo al abrir el modal
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

  // Temporizador para limpiar estado de guardado
  const notifySaved = () => {
    setSaveStatus("saved");
    setTimeout(() => {
      setSaveStatus((prev) => (prev === "saved" ? "idle" : prev));
    }, 2500);
  };

  // --- Handlers de actualización de Preferencias ---
  const handleRitmoChange = async (ritmo: RitmoVisita) => {
    if (!perfil || perfil.preferencias.ritmoVisitaPreferido === ritmo) return;

    // Actualización optimista
    const prevPerfil = perfil;
    setPerfil({
      ...perfil,
      preferencias: {
        ...perfil.preferencias,
        ritmoVisitaPreferido: ritmo,
      },
    });

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

    // Validación: debe quedar al menos uno seleccionado
    if (exists && actuales.length === 1) {
      setFeedbackMessage("Debes mantener al menos un medio de transporte seleccionado.");
      setTimeout(() => setFeedbackMessage(null), 3000);
      return;
    }

    const nuevos = exists
      ? actuales.filter((t) => t !== transporte)
      : [...actuales, transporte];

    const prevPerfil = perfil;
    setPerfil({
      ...perfil,
      preferencias: {
        ...perfil.preferencias,
        transportesPreferidos: nuevos,
      },
    });

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

  // --- Handlers de actualización de Restricciones ---
  const handleDietaToggle = async (dieta: TipoDieta) => {
    if (!perfil) return;

    const actuales = perfil.restricciones.dieta;
    const exists = actuales.includes(dieta);
    const nuevas = exists
      ? actuales.filter((d) => d !== dieta)
      : [...actuales, dieta];

    const prevPerfil = perfil;
    setPerfil({
      ...perfil,
      restricciones: {
        ...perfil.restricciones,
        dieta: nuevas,
      },
    });

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
    setPerfil({
      ...perfil,
      restricciones: {
        ...perfil.restricciones,
        [campo]: valor,
      },
    });

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

  const formatearFecha = (fechaStr: string) => {
    try {
      return new Date(fechaStr).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return fechaStr;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Configuración de Cuenta"
      size="xl"
      className="profile-modal"
    >
      <div className="profile-panel">
        {/* Columna Izquierda: Pestañas de Navegación */}
        <aside className="profile-sidebar" aria-label="Secciones del perfil">
          <nav className="profile-tabs">
            <button
              type="button"
              className={`profile-tab ${activeTab === "perfil" ? "profile-tab--active" : ""
                }`}
              onClick={() => setActiveTab("perfil")}
            >
              <svg
                className="profile-tab__icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>Perfil</span>
            </button>

            <button
              type="button"
              className={`profile-tab ${activeTab === "preferencias" ? "profile-tab--active" : ""
                }`}
              onClick={() => setActiveTab("preferencias")}
            >
              <svg
                className="profile-tab__icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              <span>Preferencias</span>
            </button>

            <button
              type="button"
              className={`profile-tab ${activeTab === "restricciones" ? "profile-tab--active" : ""
                }`}
              onClick={() => setActiveTab("restricciones")}
            >
              <svg
                className="profile-tab__icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>Restricciones</span>
            </button>
          </nav>
        </aside>

        {/* Columna Derecha: Contenido de la Sección */}
        <main className="profile-content">
          {/* Indicador flotante de autoguardado (no ocupa espacio en el flujo) */}
          {(saveStatus !== "idle" || feedbackMessage !== null) && (
            <div className="profile-status-bar" aria-live="polite">
              {saveStatus === "saving" && (
                <span className="profile-status profile-status--saving">
                  <span className="profile-status__spinner" /> Guardando...
                </span>
              )}
              {saveStatus === "saved" && (
                <span className="profile-status profile-status--saved">
                  ✓ Cambios guardados
                </span>
              )}
              {saveStatus === "error" && (
                <span className="profile-status profile-status--error">
                  ⚠ {feedbackMessage ?? "Error al guardar los cambios"}
                </span>
              )}
              {feedbackMessage && saveStatus !== "error" && (
                <span className="profile-status profile-status--info">
                  ℹ {feedbackMessage}
                </span>
              )}
            </div>
          )}

          {isLoading ? (
            <div className="profile-loading">
              <div className="skeleton profile-loading__avatar" />
              <div className="skeleton profile-loading__line" />
              <div className="skeleton profile-loading__line profile-loading__line--short" />
            </div>
          ) : error || !perfil ? (
            <div className="profile-error">
              <p>{error ?? "Ocurrió un error al cargar el perfil."}</p>
              <button
                type="button"
                className="profile-retry-btn"
                onClick={() => void loadPerfil()}
              >
                Reintentar
              </button>
            </div>
          ) : (
            <>
              {/* SECCIÓN 1: PERFIL */}
              {activeTab === "perfil" && (
                <div className="profile-section">
                  <header className="profile-section__header">
                    <h3 className="profile-section__title">Información de Usuario</h3>
                    <p className="profile-section__desc">
                      Datos vinculados a tu cuenta de acceso.
                    </p>
                  </header>

                  <div className="profile-user-card">
                    <Avatar
                      src={perfil.usuario.fotoUrl}
                      alt={perfil.usuario.nombre}
                      name={perfil.usuario.nombre}
                      size="lg"
                      className="profile-user-card__avatar"
                    />
                    <div className="profile-user-card__info">
                      <h4 className="profile-user-card__name">
                        {perfil.usuario.nombre}
                      </h4>
                      <p className="profile-user-card__email">
                        {perfil.usuario.email}
                      </p>
                      <span className="profile-user-card__badge">
                        Cuenta de Google verificada
                      </span>
                    </div>
                  </div>

                  <div className="profile-fields">
                    <div className="profile-field">
                      <span className="profile-field__label">
                        Fecha de registro
                      </span>
                      <span className="profile-field__value">
                        {formatearFecha(perfil.usuario.fechaCreacion)}
                      </span>
                    </div>

                    <div className="profile-field">
                      <span className="profile-field__label">
                        Último acceso
                      </span>
                      <span className="profile-field__value">
                        {formatearFecha(perfil.usuario.ultimoAcceso)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* SECCIÓN 2: PREFERENCIAS */}
              {activeTab === "preferencias" && (
                <div className="profile-section">
                  <header className="profile-section__header">
                    <h3 className="profile-section__title">Preferencias de Viaje</h3>
                    <p className="profile-section__desc">
                      Personaliza cómo TouringGo planifica y te sugiere itinerarios.
                    </p>
                  </header>

                  {/* Ritmo de visita (Single select) */}
                  <div className="profile-group">
                    <label className="profile-group__label">
                      Ritmo de visita preferido
                    </label>
                    <p className="profile-group__hint">
                      Selecciona la intensidad deseada para tus recorridos.
                    </p>

                    <div className="profile-options-grid">
                      {RITMO_OPCIONES.map((opcion) => {
                        const isSelected =
                          perfil.preferencias.ritmoVisitaPreferido === opcion.id;
                        return (
                          <button
                            key={opcion.id}
                            type="button"
                            className={`profile-card-option ${isSelected ? "profile-card-option--selected" : ""
                              }`}
                            onClick={() => void handleRitmoChange(opcion.id)}
                          >
                            <span className="profile-card-option__icon">
                              {opcion.icon}
                            </span>
                            <div className="profile-card-option__content">
                              <span className="profile-card-option__title">
                                {opcion.label}
                              </span>
                              <span className="profile-card-option__desc">
                                {opcion.descripcion}
                              </span>
                            </div>
                            <span className="profile-card-option__radio">
                              {isSelected && <span className="profile-card-option__radio-dot" />}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Transportes preferidos (Multi select) */}
                  <div className="profile-group">
                    <label className="profile-group__label">
                      Transportes preferidos
                    </label>
                    <p className="profile-group__hint">
                      Elige los medios que prefieres utilizar (selecciona uno o más).
                    </p>

                    <div className="profile-chips-grid">
                      {TRANSPORTE_OPCIONES.map((opcion) => {
                        const isSelected =
                          perfil.preferencias.transportesPreferidos.includes(
                            opcion.id
                          );
                        return (
                          <button
                            key={opcion.id}
                            type="button"
                            className={`profile-chip-btn ${isSelected ? "profile-chip-btn--selected" : ""
                              }`}
                            onClick={() => void handleTransporteToggle(opcion.id)}
                          >
                            <span className="profile-chip-btn__icon">
                              {opcion.icon}
                            </span>
                            <span className="profile-chip-btn__label">
                              {opcion.label}
                            </span>
                            <span className="profile-chip-btn__check">
                              {isSelected ? "✓" : "+"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* SECCIÓN 3: RESTRICCIONES */}
              {activeTab === "restricciones" && (
                <div className="profile-section">
                  <header className="profile-section__header">
                    <h3 className="profile-section__title">Restricciones y Accesibilidad</h3>
                    <p className="profile-section__desc">
                      Filtros automáticos para adaptar lugares y gastronomía a tus necesidades.
                    </p>
                  </header>

                  {/* Tipo de dieta (Multi select) */}
                  <div className="profile-group">
                    <label className="profile-group__label">
                      Preferencia y tipo de dieta
                    </label>
                    <p className="profile-group__hint">
                      Selecciona las opciones que aplican a tus hábitos o restricciones alimentarias.
                    </p>

                    <div className="profile-chips-grid">
                      {DIETA_OPCIONES.map((opcion) => {
                        const isSelected = perfil.restricciones.dieta.includes(
                          opcion.id
                        );
                        return (
                          <button
                            key={opcion.id}
                            type="button"
                            className={`profile-chip-btn ${isSelected ? "profile-chip-btn--selected" : ""
                              }`}
                            onClick={() => void handleDietaToggle(opcion.id)}
                          >
                            <span className="profile-chip-btn__label">
                              {opcion.label}
                            </span>
                            <span className="profile-chip-btn__check">
                              {isSelected ? "✓" : "+"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Accesibilidad (Switches / Toggles) */}
                  <div className="profile-group">
                    <label className="profile-group__label">
                      Accesibilidad y movilidad
                    </label>
                    <p className="profile-group__hint">
                      Ajustes para asegurar lugares adecuados a tus requerimientos de movilidad.
                    </p>

                    <div className="profile-switches-list">
                      {/* RequiereRecorridoSinEscalones */}
                      <label className="profile-switch-card">
                        <div className="profile-switch-card__info">
                          <span className="profile-switch-card__title">
                            ♿ Recorrido sin escalones
                          </span>
                          <span className="profile-switch-card__desc">
                            Priorizar accesos y trayectos sin escaleras, con rampas o ascensores.
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          className="profile-switch-input"
                          checked={perfil.restricciones.requiereRecorridoSinEscalones}
                          onChange={(e) =>
                            void handleAccesibilidadToggle(
                              "requiereRecorridoSinEscalones",
                              e.target.checked
                            )
                          }
                        />
                        <span className="profile-switch-control" />
                      </label>

                      {/* RequiereBanoAccesible */}
                      <label className="profile-switch-card">
                        <div className="profile-switch-card__info">
                          <span className="profile-switch-card__title">
                            🚻 Baño accesible
                          </span>
                          <span className="profile-switch-card__desc">
                            Priorizar instalaciones con sanitarios adaptados para personas con movilidad reducida.
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          className="profile-switch-input"
                          checked={perfil.restricciones.requiereBanoAccesible}
                          onChange={(e) =>
                            void handleAccesibilidadToggle(
                              "requiereBanoAccesible",
                              e.target.checked
                            )
                          }
                        />
                        <span className="profile-switch-control" />
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </Modal>
  );
}

