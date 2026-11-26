import type { PreferenciasCategoriaDTO } from "../types";
import { categoriaLabel, getCategoriaIcon } from "../../../lib/format";
import "./CategoriaAfinidadSlider.css";

export interface CategoriaAfinidadSliderProps {
  preferencia: PreferenciasCategoriaDTO;
  onChange: (afinidad: number) => void;
  disabled?: boolean;
}

const AFINIDAD_LABELS: Record<number, string> = {
  [-2]: "No me gusta",
  [-1]: "Poco interés",
  0: "Sin preferencia",
  1: "Interesado",
  2: "Mucho interés",
};

export function CategoriaAfinidadSlider({
  preferencia,
  onChange,
  disabled = false,
}: CategoriaAfinidadSliderProps) {
  const { categoriaCodigo, afinidad } = preferencia;
  const label = categoriaLabel(categoriaCodigo);
  const estadoActualLabel = AFINIDAD_LABELS[afinidad] ?? "Neutral / Sin preferencia";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  return (
    <div className="categoria-afinidad-slider">
      <div className="categoria-afinidad-slider__header">
        <label
          htmlFor={`slider-${categoriaCodigo}`}
          className="categoria-afinidad-slider__title"
          >
          <span className="categoria-afinidad-slider__icon">
            {getCategoriaIcon(categoriaCodigo)}
          </span>
          {label}
        </label>
        <span
          className={`categoria-afinidad-slider__badge afinidad-${afinidad}`}
          aria-live="polite"
        >
          {estadoActualLabel}
        </span>
      </div>

      <div className="categoria-afinidad-slider__control">
        <input
          id={`slider-${categoriaCodigo}`}
          type="range"
          min={-2}
          max={2}
          step={1}
          value={afinidad}
          onChange={handleChange}
          disabled={disabled}
          className="categoria-afinidad-slider__range"
          aria-label={`Afinidad para ${label}`}
          aria-valuemin={-2}
          aria-valuemax={2}
          aria-valuenow={afinidad}
          aria-valuetext={estadoActualLabel}
        />

        <div className="categoria-afinidad-slider__ticks" aria-hidden="true">
          <span className={`tick ${afinidad === -2 ? "is-active" : ""}`} />
          <span className={`tick ${afinidad === -1 ? "is-active" : ""}`} />
          <span className={`tick ${afinidad === 0 ? "is-active" : ""}`} />
          <span className={`tick ${afinidad === 1 ? "is-active" : ""}`} />
          <span className={`tick ${afinidad === 2 ? "is-active" : ""}`} />
        </div>

        <div className="categoria-afinidad-slider__labels" aria-hidden="true">
          <span className="categoria-afinidad-slider__label-extremo extremo-izq">
            No me gusta
          </span>
          <span className="categoria-afinidad-slider__label-neutral">
            Neutral
          </span>
          <span className="categoria-afinidad-slider__label-extremo extremo-der">
            Mucho interés
          </span>
        </div>
      </div>
    </div>
  );
}

export default CategoriaAfinidadSlider;
