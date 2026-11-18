import type { KeyboardEvent, Ref } from "react";
import { formatFullDate } from "./dateUtils";

export interface DayCellProps {
  date: Date;
  selected?: boolean;
  inRange?: boolean;
  disabled?: boolean;
  hasEvent?: boolean;
  tabIndex?: number;
  onSelect: (date: Date) => void;
  onKeyDown?: (
    event: KeyboardEvent<HTMLButtonElement>,
    date: Date
  ) => void;
  buttonRef?: Ref<HTMLButtonElement>;
}

export function DayCell({
  date,
  selected = false,
  inRange = false,
  disabled = false,
  hasEvent = false,
  tabIndex,
  onSelect,
  onKeyDown,
  buttonRef,
}: DayCellProps) {
  const className = [
    "date-widget__day",
    selected ? "date-widget__day--selected" : "",
    inRange ? "date-widget__day--in-range" : "",
    disabled ? "date-widget__day--disabled" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      ref={buttonRef}
      type="button"
      className={className}
      aria-label={formatFullDate(date)}
      aria-pressed={selected}
      aria-disabled={disabled}
      disabled={disabled}
      tabIndex={disabled ? -1 : tabIndex}
      onClick={() => onSelect(date)}
      onKeyDown={(event) => onKeyDown?.(event, date)}
    >
      <span className="date-widget__day-number">{date.getDate()}</span>
      {hasEvent && (
        <span className="date-widget__event-dot" aria-hidden="true" />
      )}
    </button>
  );
}

export default DayCell;
