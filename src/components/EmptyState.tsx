import "./EmptyState.css";

interface EmptyStateProps {
  onLimpiar: () => void;
}

export default function EmptyState({ onLimpiar }: EmptyStateProps) {
  return (
    <div className="empty-state" role="status">
      <span className="empty-state__icon" aria-hidden="true">
        🔍
      </span>
      <h3 className="empty-state__title">No encontramos lugares con esos filtros</h3>
      <p className="empty-state__text">Probá cambiar o quitar algún filtro para ver más resultados.</p>
      <button type="button" className="empty-state__btn" onClick={onLimpiar}>
        Limpiar filtros
      </button>
    </div>
  );
}
