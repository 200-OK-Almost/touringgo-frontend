import type { PreferenciasCategoriaDTO } from "../types";
import { categoriaLabel, getCategoriaIcon } from "../../../lib/format";
import "./CategoriaAfinidadSlider.css";

export interface CategoriaAfinidadSliderProps {
  preferencia: PreferenciasCategoriaDTO;
  onChange: (afinidad: number) => void;
  onChangeEnd?: (afinidad: number) => void;
  disabled?: boolean;
  variant?: "default" | "compact";
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
  onChangeEnd,
  disabled = false,
  variant = "default",
}: CategoriaAfinidadSliderProps) {
  const { categoriaCodigo, afinidad } = preferencia;
  const label = categoriaLabel(categoriaCodigo);
  const estadoActualLabel = AFINIDAD_LABELS[afinidad] ?? "Neutral / Sin preferencia";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLInputElement>) => {
    if (onChangeEnd) {
      onChangeEnd(Number((e.target as HTMLInputElement).value));
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      onChangeEnd &&
      (e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
        e.key === "ArrowUp" ||
        e.key === "ArrowDown" ||
        e.key === "Home" ||
        e.key === "End")
    ) {
      onChangeEnd(Number((e.target as HTMLInputElement).value));
    }
  };

  const isCompact = variant === "compact";

  return (
    <div className={`categoria-afinidad-slider categoria-afinidad-slider--${variant}`}>
      <div className="categoria-afinidad-slider__header">
        <label
          htmlFor={`slider-${categoriaCodigo}`}
          className="categoria-afinidad-slider__title"
        >
          <span className="categoria-afinidad-slider__icon">
            {getCategoriaIcon(categoriaCodigo)}
          </span>
          <span className="categoria-afinidad-slider__name">{label}</span>
        </label>
        {!isCompact && (
          <span
            className={`categoria-afinidad-slider__badge afinidad-${afinidad}`}
            aria-live="polite"
          >
            {estadoActualLabel}
          </span>
        )}
      </div>

      <div className="categoria-afinidad-slider__control">
        <div className="categoria-afinidad-slider__track-wrapper">
          <input
            id={`slider-${categoriaCodigo}`}
            type="range"
            min={-2}
            max={2}
            step={1}
            value={afinidad}
            onChange={handleChange}
            onPointerUp={handlePointerUp}
            onKeyUp={handleKeyUp}
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
        </div>

        {!isCompact && (
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
        )}
      </div>

      {isCompact && (
        <div className="categoria-afinidad-slider__compact-status">
          <span
            className={`categoria-afinidad-slider__badge afinidad-${afinidad}`}
            aria-live="polite"
          >
            {estadoActualLabel}
          </span>
        </div>
      )}
    </div>
  );
}

export default CategoriaAfinidadSlider;
