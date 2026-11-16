import { useEffect, useState, type FormEvent, type KeyboardEvent } from "react";
import { IoPencilOutline } from "react-icons/io5";
import { Modal } from "../../../components/Modal"
import type { ViajeDto } from "../../viaje/types";
import { actualizarViaje, construirViajeUpdateDto, getMisViajes } from "../../viaje/api/viajes";
import { Link } from "react-router-dom";
import "./MisViajesModal.css"
import { capitalize } from "../../../lib/format";
import { construirDiasViaje } from "../../viaje/lib/diasViaje";

function formatearFechaCreacion(fecha: string): string {
  const [soloFecha] = fecha.split("T");
  return soloFecha || "—";
}
export interface MisViajesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function MisViajesModal({isOpen, onClose}: MisViajesModalProps) {
  const [viajes, setViajes] = useState<ViajeDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tituloDraft, setTituloDraft] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleClose = () => {
    setEditingId(null);
    setTituloDraft("");
    setSavingId(null);
    setActionError(null);
    onClose();
    setTimeout(() => {}, 300); // Espera a la animación de cierre
  };

  function handleIniciarEdicion(viaje: ViajeDto) {
    setEditingId(viaje.id);
    setTituloDraft(viaje.titulo ?? "");
    setActionError(null);
  }

  function handleCancelarEdicion() {
    if (savingId) return;
    setEditingId(null);
    setTituloDraft("");
    setActionError(null);
  }

  async function handleGuardarTitulo(event: FormEvent<HTMLFormElement>, viaje: ViajeDto) {
    event.preventDefault();

    const titulo = tituloDraft.trim();
    if (!titulo) {
      setActionError("El título no puede estar vacío.");
      return;
    }

    setSavingId(viaje.id);
    setActionError(null);

    try {
      const actualizado = await actualizarViaje(
        viaje.id,
        construirViajeUpdateDto(viaje, titulo)
      );
      setViajes((prev) => prev.map((item) => (item.id === viaje.id ? actualizado : item)));
      setEditingId(null);
      setTituloDraft("");
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "No se pudo actualizar el título."
      );
    } finally {
      setSavingId(null);
    }
  }

  function handleTituloKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      handleCancelarEdicion();
    }
  }

  useEffect(() => {
    // Evitar la petición si el modal no está abierto
    if (!isOpen) return;

    let isMounted = true;
    async function cargarViajes() {
      setLoading(true);
      setError(null);
      try {
        const viajesData = await getMisViajes();
        if (isMounted) {
          setViajes(Array.isArray(viajesData.items) ? viajesData.items : []);
        }
      } catch {
        if (isMounted) {
          setError("No se pudieron cargar tus viajes.");
          setViajes([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    cargarViajes();
    return () => {
      isMounted = false;
    };
  }, [isOpen]);
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title="Mis viajes" 
      size="md" 
      className="profile-modal mis-viajes-modal"
    >
      <div className="mis-viajes">
        {loading ? (
          <>
          {/* <p className="text-muted">Cargando tus viajes...</p> */}
          {Array.from({ length: 8 }, () => 
            <div className="skeleton" style={{ height: "57px", width: "100%", borderRadius: "4px" }} />
          )}
          </>
        ) : error ? (
          <p className="text-muted">{error}</p>
        ) : viajes.length === 0 ? (
          <p className="text-muted">Aún no tienes viajes creados.</p>
        ) : (
          viajes.map((viaje) => {
            const cantidadDias = construirDiasViaje(
              viaje.fechaInicio,
              viaje.fechaFin,
              viaje.itinerarios
            ).dias.length;
            const textoDias = cantidadDias === 1 ? "1 Día" : `${cantidadDias} Días`;
            const tituloViaje = viaje.titulo || `Salida por ${viaje.barrio}`;

            return (
              <div key={viaje.id} className="viaje-item">
                {editingId === viaje.id ? (
                  <form
                    className="viaje-edit-form"
                    onSubmit={(event) => void handleGuardarTitulo(event, viaje)}
                  >
                    <input
                      type="text"
                      className="viaje-edit-input"
                      value={tituloDraft}
                      maxLength={100}
                      autoFocus
                      placeholder={tituloViaje}
                      aria-label="Título del viaje"
                      disabled={savingId === viaje.id}
                      onChange={(event) => {
                        setTituloDraft(event.target.value);
                        if (actionError) setActionError(null);
                      }}
                      onKeyDown={handleTituloKeyDown}
                    />
                    <div className="viaje-edit-actions">
                      <button
                        type="submit"
                        className="viaje-action-btn viaje-action-btn--primary"
                        disabled={savingId === viaje.id}
                      >
                        {savingId === viaje.id ? "Guardando..." : "Guardar"}
                      </button>
                      <button
                        type="button"
                        className="viaje-action-btn viaje-action-btn--secondary"
                        onClick={handleCancelarEdicion}
                        disabled={savingId === viaje.id}
                      >
                        Cancelar
                      </button>
                    </div>
                    {actionError && (
                      <p className="viaje-action-error" role="alert">
                        {actionError}
                      </p>
                    )}
                  </form>
                ) : (
                  <>
                    <Link
                      to={`/viajes/${viaje.id}`}
                      onClick={handleClose}
                      className="viaje-link"
                    >
                      <div className="viaje-link-left">
                        <p className="viaje-link-title">{tituloViaje}</p>
                        <p className="viaje-link-info">
                          {capitalize(viaje.barrio)}
                          <span>·</span>
                          {capitalize(viaje.tipoViaje)}
                          <span>·</span>
                          {viaje.ritmoCaminata}
                          <span>·</span>
                          {textoDias}
                        </p>
                      </div>
                      <div className="viaje-link-right">
                        <p className="viaje-link-date">{formatearFechaCreacion(viaje.fechaCreacion)}</p>
                      </div>
                    </Link>
                    <div className="viaje-actions">
                      <button
                        type="button"
                        className="viaje-action-btn-icon"
                        onClick={() => handleIniciarEdicion(viaje)}
                        aria-label={`Editar título de ${tituloViaje}`}
                        title="Editar título"
                      >
                        <IoPencilOutline aria-hidden="true" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })
        )}
      </div>
    </Modal>
  )
}
export default MisViajesModal