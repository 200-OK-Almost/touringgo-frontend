import { useState } from "react";
import type { ViajeDto } from "../../../types";
import { IoCheckmarkOutline, IoCopyOutline, IoPersonCircleOutline, IoShareSocialOutline } from "react-icons/io5";
import "./MiembrosTab.css";

interface MiembrosTabProps {
  viaje: ViajeDto;
}

export function MiembrosTab({ viaje }: MiembrosTabProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    if (!viaje.codigoInvitacion) return;
    try {
      await navigator.clipboard.writeText(viaje.codigoInvitacion);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Error al copiar código de invitación:", err);
    }
  };

  return (
    <div className="miembros-tab">
      <div className="miembros-tab__header">
        <h2>Miembros del viaje</h2>
        <p className="miembros-tab__subtitle">
          Organiza el itinerario con amigos o compañeros de viaje
        </p>
      </div>

      <div className="miembros-tab__body">
        {viaje.codigoInvitacion && (
          <div className="miembros-tab__invite-card">
            <span className="miembros-tab__invite-label">Código de invitación</span>
            <div className="miembros-tab__invite-code-row">
              <span className="miembros-tab__invite-code">{viaje.codigoInvitacion}</span>
              <button
                type="button"
                className="miembros-tab__copy-btn"
                onClick={handleCopyCode}
                title="Copiar código al portapapeles"
              >
                {copied ? <IoCheckmarkOutline /> : <IoCopyOutline />}
                <span>{copied ? "¡Copiado!" : "Copiar"}</span>
              </button>
            </div>
            <p className="miembros-tab__invite-hint">
              Comparte este código para que otras personas puedan unirse a este viaje.
            </p>
          </div>
        )}

        <div className="miembros-tab__section">
          <h3>Participantes</h3>
          <ul className="miembros-tab__list">
            <li className="miembros-tab__item">
              <IoPersonCircleOutline className="miembros-tab__avatar" />
              <div className="miembros-tab__info">
                <span className="miembros-tab__name">Organizador</span>
                <span className="miembros-tab__role">Creador del viaje</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="miembros-tab__footer">
        <button
          type="button"
          className="miembros-tab__share-btn"
          onClick={handleCopyCode}
        >
          <IoShareSocialOutline />
          <span>Compartir invitación</span>
        </button>
      </div>
    </div>
  );
}

export default MiembrosTab;
