import { Modal } from "./Modal";
import GoogleLoginButton from "./GoogleLoginButton";
import "./LoginModal.css";
import { IoSparklesOutline } from "react-icons/io5";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Iniciar sesión"
      size="sm"
      className="login-modal"
    >
      <div className="login-modal__container">
        <div className="login-modal__icon-badge" aria-hidden="true">
          <IoSparklesOutline />
        </div>

        <h3 className="login-modal__title">¡Empezá a planificar tu salida!</h3>

        <p className="login-modal__description">
          Iniciá sesión para armar itinerarios inteligentes y personalizados según tus gustos, presupuesto y ritmo de viaje.
        </p>

        <div className="login-modal__action">
          <GoogleLoginButton />
        </div>

        <p className="login-modal__terms">
          Al continuar, aceptas la política de uso y privacidad de TouringGo.
        </p>
      </div>
    </Modal>
  );
}

export default LoginModal;
