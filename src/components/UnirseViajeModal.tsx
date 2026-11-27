import { useState } from "react";
import { Modal } from "./Modal";
import PasteButton from "./PasteButton";
import "./UnirseViajeModal.css"
import { unirseViaje } from "../features/viaje/api/viajes";
import { useNavigate } from "react-router-dom";
export interface UnirseViajeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function UnirseViajeModal({isOpen, onClose} : UnirseViajeModalProps) {
  const navigate = useNavigate();

  const [codigo, setCodigo] = useState('');
  const [, setError] = useState('');
  const [, setSubmitLoading] = useState(false)

  const handlePaste = async () => {
    try {
      setError('');
      const clipboardText = await navigator.clipboard.readText();
      setCodigo(clipboardText);
    } catch (err) {
      setError('Failed to read clipboard. Please allow clipboard permissions.');
      console.error(err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  async function handleSubmit() {
    setSubmitLoading(true);

    try {
      const response = await unirseViaje(codigo);
      navigate(`/viajes/${response.id}`);
    } catch {
      // handle unauthorized and else here
    } finally {
      setSubmitLoading(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={"Unirse a un viaje"} 
      size="md" 
      className="profile-modal mis-viajes-modal"
    >
        <div className="unirse-viaje">
          <h3 className="unirse-viaje-title">Ingresa el código de invitación</h3>
          <div className="unirse-viaje-form">
            <input 
              type="text"
              placeholder="XXXXXXXXXX"
              className="unirse-viaje-input"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e)}
            />
            <PasteButton 
              onClick={handlePaste}
              className="unirse-viaje-paste-btn"
            />
          </div>
          <button
            className="unirse-viaje-submit-btn"
            onClick={handleSubmit}
          >
            Unirse
          </button>
        </div>
    </Modal>
  )
}
export default UnirseViajeModal