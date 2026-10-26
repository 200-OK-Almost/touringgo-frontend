import "./ErrorState.css";

interface ErrorStateProps {
  message?: string;
  onReintentar: () => void;
}

export default function ErrorState({ message, onReintentar }: ErrorStateProps) {
  return (
    <div className="error-state" role="alert">
      <span className="error-state__icon" aria-hidden="true">
        ⚠️
      </span>
      <h3 className="error-state__title">No pudimos cargar los lugares</h3>
      <p className="error-state__text">{message ?? "Ocurrió un error inesperado. Intentá de nuevo."}</p>
      <button type="button" className="error-state__btn" onClick={onReintentar}>
        Reintentar
      </button>
    </div>
  );
}
