export interface DurationChipsProps {
  durations: number[];
  value: number;
  onChange: (duration: number) => void;
}

function formatDuration(days: number): string {
  return days === 1 ? "1 día" : `${days} días`;
}

export function DurationChips({
  durations,
  value,
  onChange,
}: DurationChipsProps) {
  return (
    <div
      className="date-widget__chips"
      role="group"
      aria-label="Duración del viaje"
    >
      {durations.map((duration) => (
        <button
          key={duration}
          type="button"
          className={`date-widget__chip${
            duration === value ? " date-widget__chip--active" : ""
          }`}
          aria-pressed={duration === value}
          onClick={() => onChange(duration)}
        >
          {formatDuration(duration)}
        </button>
      ))}
    </div>
  );
}

export default DurationChips;
