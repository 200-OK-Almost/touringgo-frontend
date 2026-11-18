export type CalendarView = "week" | "month";

export interface ViewToggleProps {
  view: CalendarView;
  onChange: (view: CalendarView) => void;
}

const OPTIONS: Array<{ value: CalendarView; label: string }> = [
  { value: "week", label: "Semanal" },
  { value: "month", label: "Mensual" },
];

export function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="date-widget__topbar">
      <div
        className="date-widget__toggle"
        role="group"
        aria-label="Vista del calendario"
      >
        {OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`date-widget__toggle-button${
              view === option.value
                ? " date-widget__toggle-button--active"
                : ""
            }`}
            aria-pressed={view === option.value}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ViewToggle;
