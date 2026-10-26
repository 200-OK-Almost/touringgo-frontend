import type { ChipOption } from "../lib/filtros";
import "./ChipGroup.css";

interface ChipGroupProps<T extends string> {
  allLabel: string;
  options: readonly ChipOption<T>[];
  value: T | null;
  onChange: (value: T | null) => void;
  variant: "ink" | "green";
}

function ChipGroup<T extends string>({
  allLabel,
  options,
  value,
  onChange,
  variant,
}: ChipGroupProps<T>) {
  return (
    <div className={`chip-group chip-group--${variant}`} role="group">
      <button
        type="button"
        className={`chip ${value === null ? "chip--active" : ""}`}
        aria-pressed={value === null}
        onClick={() => onChange(null)}
      >
        {allLabel}
      </button>

      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`chip ${value === opt.value ? "chip--active" : ""}`}
          aria-pressed={value === opt.value}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default ChipGroup;
