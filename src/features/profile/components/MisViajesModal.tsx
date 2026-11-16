import { useEffect, useState } from "react";
import { Modal } from "../../../components/Modal"
import type { ViajeDto } from "../../viaje/types";
import { getMisViajes } from "../../viaje/api/viajes";
import { Link } from "react-router-dom";
import "./MisViajesModal.css"
import { capitalize, getDayAndMonth, toDateOnlyString } from "../../../lib/format";
export interface MisViajesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function MisViajesModal({isOpen, onClose}: MisViajesModalProps) {
  const [viajes, setViajes] = useState<ViajeDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    onClose();
    setTimeout(() => {}, 300); // Espera a la animación de cierre
  };

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
      } catch (err) {
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
          {Array.from({ length: 8 }, (_) => 
            <div className="skeleton" style={{ height: "57px", width: "100%", borderRadius: "4px" }} />
          )}
          </>
        ) : error ? (
          <p className="text-muted">{error}</p>
        ) : viajes.length === 0 ? (
          <p className="text-muted">Aún no tienes viajes creados.</p>
        ) : (
          viajes.map((viaje) => (
            <Link 
              key={viaje.id} 
              to={`/viajes/${viaje.id}`}
              onClick={onClose}
              className="viaje-link"
            >
              <div className="viaje-link-left">
                <p className="viaje-link-title">
                  {viaje.titulo || `Salida por ${viaje.barrio}`}
                </p>
                <p className="viaje-link-info">
                  {capitalize(viaje.barrio)}
                  <span>·</span>
                  {capitalize(viaje.tipoViaje)}
                  <span>·</span>
                  {viaje.ritmoCaminata}
                  <span>·</span>
                  {viaje?.itinerarios?.length == 1 ? `${viaje?.itinerarios?.length} Día` : `${viaje?.itinerarios?.length} Días`} 
                </p>
              </div>
              <div className="viaje-link-right">
                <p className="viaje-link-date">{toDateOnlyString(new Date(viaje.fechaCreacion))}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </Modal>
  )
}
export default MisViajesModal