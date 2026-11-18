import { useMemo } from "react";
import { getWeekDays, WEEKDAY_INITIALS } from "./dateUtils";
import type { RenderDay } from "./types";

export interface WeekViewProps {
  cursor: Date;
  renderDay: RenderDay;
}

export function WeekView({ cursor, renderDay }: WeekViewProps) {
  const days = useMemo(() => getWeekDays(cursor), [cursor]);

  return (
    <div className="date-widget__view date-widget__view--week">
      <div className="date-widget__weekdays" aria-hidden="true">
        {WEEKDAY_INITIALS.map((initial, index) => (
          <span key={`${initial}-${index}`} className="date-widget__weekday">
            {initial}
          </span>
        ))}
      </div>

      <div
        className="date-widget__week"
        role="group"
        aria-label="Días de la semana"
      >
        {days.map((day) => (
          <div key={day.getTime()} className="date-widget__day-slot">
            {renderDay(day)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeekView;
