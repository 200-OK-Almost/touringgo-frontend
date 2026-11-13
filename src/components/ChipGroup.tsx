import type { ChipOption } from "../lib/filtros";
import "./ChipGroup.css";

export interface ChipGroupProps<T extends string> {
  allLabel: string;
  options: readonly ChipOption<T>[];
  value: T | null;
  onChange: (value: T | null) => void;
  variant: "ink" | "green";
  isOptionDisabled?: (value: T | null) => boolean;
  disabledTooltip?: string | ((value: T | null) => string | undefined);
}

export function ChipGroup<T extends string>({
  allLabel,
  options,
  value,
  onChange,
  variant,
  isOptionDisabled,
  disabledTooltip,
}: ChipGroupProps<T>) {
  const isAllDisabled = isOptionDisabled ? isOptionDisabled(null) : false;
  const allTooltip = isAllDisabled
    ? typeof disabledTooltip === "function"
      ? disabledTooltip(null)
      : disabledTooltip
    : undefined;

  return (
    <div className={`chip-group chip-group--${variant}`} role="group">
      <button
        type="button"
        disabled={isAllDisabled}
        className={`chip ${value === null ? "chip--active" : ""} ${isAllDisabled ? "chip--disabled" : ""}`}
        aria-pressed={value === null}
        title={allTooltip}
        onClick={() => !isAllDisabled && onChange(null)}
      >
        {allLabel}
      </button>

      {options.map((opt) => {
        const isDisabled = isOptionDisabled ? isOptionDisabled(opt.value) : false;
        const optTooltip = isDisabled
          ? typeof disabledTooltip === "function"
            ? disabledTooltip(opt.value)
            : disabledTooltip
          : undefined;

        return (
          <button
            key={opt.value}
            type="button"
            disabled={isDisabled}
            className={`chip ${value === opt.value ? "chip--active" : ""} ${isDisabled ? "chip--disabled" : ""}`}
            aria-pressed={value === opt.value}
            title={optTooltip}
            onClick={() => !isDisabled && onChange(opt.value)}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export default ChipGroup;
