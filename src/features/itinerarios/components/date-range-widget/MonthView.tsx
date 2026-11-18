import { useMemo } from "react";
import { getMonthGrid, WEEKDAY_INITIALS } from "./dateUtils";
import type { RenderDay } from "./types";

export interface MonthViewProps {
  cursor: Date;
  renderDay: RenderDay;
}

export function MonthView({ cursor, renderDay }: MonthViewProps) {
  const cells = useMemo(
    () => getMonthGrid(cursor.getFullYear(), cursor.getMonth()),
    [cursor]
  );

  return (
    <div className="date-widget__view date-widget__view--month">
      <div className="date-widget__weekdays" aria-hidden="true">
        {WEEKDAY_INITIALS.map((initial, index) => (
          <span key={`${initial}-${index}`} className="date-widget__weekday">
            {initial}
          </span>
        ))}
      </div>

      <div
        className="date-widget__month"
        role="group"
        aria-label="Días del mes"
      >
        {cells.map((cell) => (
          <div key={cell.date.getTime()} className="date-widget__day-slot">
            {renderDay(cell.date, !cell.inCurrentMonth)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MonthView;
