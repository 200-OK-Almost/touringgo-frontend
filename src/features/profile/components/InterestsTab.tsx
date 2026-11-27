import type { CategoriaCodigo, PreferenciasCategoriaDTO } from "../types";
import CategoriaAfinidadSlider from "./CategoriaAfinidadSlider";

interface InterestsTabProps {
  preferenciasCategorias: PreferenciasCategoriaDTO[];
  onAfinidadChange: (categoriaCodigo: CategoriaCodigo, afinidad: number) => void;
  onAfinidadChangeEnd?: (categoriaCodigo: CategoriaCodigo, afinidad: number) => void;
}

export function InterestsTab({ 
  preferenciasCategorias,
  onAfinidadChange,
  onAfinidadChangeEnd,
}: InterestsTabProps) {
  return (
    <div className="profile-section">
      <header className="profile-section__header">
        <h3 className="profile-section__title">Categorías de interés</h3>
        <p className="profile-section__desc">
          Ajustá tu nivel de afinidad por cada tipo de lugar para personalizar las sugerencias de tus itinerarios.
        </p>
      </header>
      <div className="profile-group">
        <div className="profile-sliders-list">
          {preferenciasCategorias.map((pref) => (
            <CategoriaAfinidadSlider
              key={pref.categoriaCodigo}
              preferencia={pref}
              variant="compact"
              onChange={(afinidad) => onAfinidadChange(pref.categoriaCodigo, afinidad)}
              onChangeEnd={onAfinidadChangeEnd ? (afinidad) => onAfinidadChangeEnd(pref.categoriaCodigo, afinidad) : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default InterestsTab;
