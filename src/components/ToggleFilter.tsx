import "./ToggleFilter.css";

interface ToggleFilterProps {
  emoji: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function ToggleFilter({ emoji, label, checked, onChange }: ToggleFilterProps) {
  return (
    <label className={`toggle ${checked ? "toggle--on" : ""}`}>
      <input
        type="checkbox"
        className="toggle__input"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="toggle__switch" aria-hidden="true" />
      <span className="toggle__emoji" aria-hidden="true">
        {emoji}
      </span>
      <span className="toggle__label">{label}</span>
    </label>
  );
}

export default ToggleFilter;
