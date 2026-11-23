import { Modal } from "../../../components/Modal";
import type { Turno } from "../types";
import "./ConfirmarEliminarParadaModal.css";

interface ConfirmarEliminarParadaModalProps {
  isOpen: boolean;
  nombre: string;
  turno: Turno;
  eliminando: boolean;
  error: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

function etiquetaTurno(turno: Turno): string {
  switch (turno) {
    case "Manana":
      return "Mañana";
    case "Mediodia":
      return "Mediodía";
    case "Tarde":
      return "Tarde";
    case "Noche":
      return "Noche";
    default:
      return turno;
  }
}

export function ConfirmarEliminarParadaModal({
  isOpen,
  nombre,
  turno,
  eliminando,
  error,
  onClose,
  onConfirm,
}: ConfirmarEliminarParadaModalProps) {
  const cerrar = () => {
    if (!eliminando) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={cerrar}
      title="Quitar parada"
      size="sm"
      showCloseButton={!eliminando}
    >
      <div className="confirmar-eliminar-parada">
        <p className="confirmar-eliminar-parada__texto">
          ¿Querés quitar <strong>{nombre}</strong> del turno{" "}
          {etiquetaTurno(turno)}?
        </p>
        <p className="confirmar-eliminar-parada__detalle">
          El turno quedará libre para agregar otra parada.
        </p>

        {error && (
          <p className="confirmar-eliminar-parada__error" role="alert">
            {error}
          </p>
        )}

        <div className="confirmar-eliminar-parada__acciones">
          <button
            type="button"
            className="confirmar-eliminar-parada__cancelar"
            onClick={cerrar}
            disabled={eliminando}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="confirmar-eliminar-parada__confirmar"
            onClick={onConfirm}
            disabled={eliminando}
            aria-busy={eliminando}
          >
            {eliminando ? "Quitando..." : "Quitar"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmarEliminarParadaModal;
