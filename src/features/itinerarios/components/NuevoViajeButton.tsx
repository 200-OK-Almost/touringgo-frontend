import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoAddOutline } from "react-icons/io5";
import { Modal } from "../../../components/Modal";
import {
  leerPlanificacionDraft,
  usePlanificacionDraft,
} from "../hooks/usePlanificacionDraft";
import "./NuevoViajeButton.css";

export interface NuevoViajeButtonProps {
  variant?: "nav" | "primary" | "ghost";
  onBeforeNavigate?: () => void;
  className?: string;
  label?: string;
}

export function NuevoViajeButton({
  variant = "primary",
  onBeforeNavigate,
  className = "",
  label = "Nuevo viaje",
}: NuevoViajeButtonProps) {
  const navigate = useNavigate();
  const { clearDraft } = usePlanificacionDraft();
  const [confirmacionAbierta, setConfirmacionAbierta] = useState(false);

  function irAPlanificacion() {
    clearDraft();
    onBeforeNavigate?.();
    navigate("/planificacion?nuevo=1");
  }

  function handleClick() {
    if (leerPlanificacionDraft()) {
      setConfirmacionAbierta(true);
      return;
    }

    irAPlanificacion();
  }

  function confirmarDescarte() {
    setConfirmacionAbierta(false);
    irAPlanificacion();
  }

  return (
    <>
      <button
        type="button"
        className={`nuevo-viaje-btn nuevo-viaje-btn--${variant} ${className}`.trim()}
        onClick={handleClick}
        aria-label={label}
      >
        <IoAddOutline aria-hidden="true" />
        <span className="nuevo-viaje-btn__label">{label}</span>
      </button>

      <Modal
        isOpen={confirmacionAbierta}
        onClose={() => setConfirmacionAbierta(false)}
        title="Descartar borrador"
        size="sm"
      >
        <div className="nuevo-viaje-confirm">
          <p>
            Tenés un borrador sin terminar. Si empezás un nuevo viaje, se va a
            descartar.
          </p>
          <div className="nuevo-viaje-confirm__actions">
            <button
              type="button"
              className="nuevo-viaje-confirm__btn nuevo-viaje-confirm__btn--secondary"
              onClick={() => setConfirmacionAbierta(false)}
            >
              Seguir editando
            </button>
            <button
              type="button"
              className="nuevo-viaje-confirm__btn nuevo-viaje-confirm__btn--primary"
              onClick={confirmarDescarte}
            >
              Descartar y empezar
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default NuevoViajeButton;
