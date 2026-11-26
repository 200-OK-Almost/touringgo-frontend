import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayCell } from "./DayCell";
import { DurationChips } from "./DurationChips";
import { MonthView } from "./MonthView";
import { ViewToggle } from "./ViewToggle";
import { WeekView } from "./WeekView";
import {
  addDays,
  formatMonthYear,
  formatRangeSummary,
  isBeforeDay,
  isSameDay,
  startOfDay,
  startOfWeek,
} from "./dateUtils";
import "./DateRangeWidget.css";
import type { CalendarView } from "./ViewToggle";

const DEFAULT_DURATIONS = [1, 2, 3, 4, 5, 6, 7];
const EMPTY_EVENT_DATES: Date[] = [];
const SWIPE_THRESHOLD = 40;

export interface DateRangeWidgetProps {
  value: Date | null;
  onChange: (start: Date, end: Date) => void;
  durations?: number[];
  minDate?: Date;
  eventDates?: Date[];
  initialDuration?: number;
}

export function DateRangeWidget({
  value,
  onChange,
  durations = DEFAULT_DURATIONS,
  minDate,
  eventDates = EMPTY_EVENT_DATES,
  initialDuration,
}: DateRangeWidgetProps) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const min = useMemo(() => startOfDay(minDate ?? today), [minDate, today]);
  const durationOptions = durations.length > 0 ? durations : DEFAULT_DURATIONS;
  const startDate = useMemo(() => normalizeValue(value, min), [value, min]);

  const [view, setView] = useState<CalendarView>("week");
  const [duration, setDuration] = useState(
    () => initialDuration ?? durationOptions[0] ?? 1
  );
  const [cursor, setCursor] = useState<Date>(() => startDate ?? min);
  const [focusedDate, setFocusedDate] = useState<Date>(
    () => startDate ?? min
  );

  const shouldFocusRef = useRef(false);
  const dayRefs = useRef(new Map<number, HTMLButtonElement>());
  const swipeStartRef = useRef<{
    x: number;
    y: number;
    pointerId: number;
  } | null>(null);

  const endDate = useMemo(
    () => (startDate ? addDays(startDate, duration - 1) : null),
    [startDate, duration]
  );

  const eventDayKeys = useMemo(
    () =>
      new Set(
        eventDates.map((eventDate) => startOfDay(eventDate).getTime())
      ),
    [eventDates]
  );

  const firstOfMinMonth = useMemo(
    () => new Date(min.getFullYear(), min.getMonth(), 1),
    [min]
  );

  const canNavigatePrev = useMemo(() => {
    if (view === "week") {
      const previousWeekStart = addDays(startOfWeek(cursor), -7);

      return !isBeforeDay(previousWeekStart, firstOfMinMonth);
    }

    const previousMonth = new Date(
      cursor.getFullYear(),
      cursor.getMonth() - 1,
      1
    );

    return !isBeforeDay(previousMonth, firstOfMinMonth);
  }, [view, cursor, firstOfMinMonth]);

  const registerDayRef = useCallback(
    (date: Date, element: HTMLButtonElement | null) => {
      const key = startOfDay(date).getTime();

      if (element) {
        dayRefs.current.set(key, element);
      } else {
        dayRefs.current.delete(key);
      }
    },
    []
  );

  useEffect(() => {
    if (!shouldFocusRef.current) {
      return;
    }

    shouldFocusRef.current = false;
    const element = dayRefs.current.get(startOfDay(focusedDate).getTime());
    element?.focus();
  }, [focusedDate, cursor, view]);

  const navigate = useCallback(
    (direction: -1 | 1) => {
      if (direction === -1 && !canNavigatePrev) {
        return;
      }

      if (view === "week") {
        const nextCursor = addDays(cursor, direction * 7);
        setCursor(nextCursor);
        setFocusedDate(firstEnabledDayInWeek(nextCursor, min));
        return;
      }

      const nextCursor = new Date(
        cursor.getFullYear(),
        cursor.getMonth() + direction,
        1
      );
      setCursor(nextCursor);
      setFocusedDate(firstEnabledDayInMonth(nextCursor, min));
    },
    [canNavigatePrev, cursor, min, view]
  );

  const selectDay = useCallback(
    (date: Date) => {
      const nextStart = startOfDay(date);

      if (isBeforeDay(nextStart, min)) {
        return;
      }

      setCursor(nextStart);
      setFocusedDate(nextStart);
      onChange(nextStart, addDays(nextStart, duration - 1));
    },
    [duration, min, onChange]
  );

  const handleDurationChange = useCallback(
    (nextDuration: number) => {
      setDuration(nextDuration);

      if (startDate) {
        onChange(startDate, addDays(startDate, nextDuration - 1));
      }
    },
    [onChange, startDate]
  );

  const handleDayKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, date: Date) => {
      const offset = KEYBOARD_OFFSETS[event.key];

      if (offset === undefined) {
        return;
      }

      event.preventDefault();
      const next = addDays(date, offset);

      if (isBeforeDay(next, min)) {
        return;
      }

      shouldFocusRef.current = true;
      setFocusedDate(next);
      setCursor(next);
    },
    [min]
  );

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    swipeStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      pointerId: event.pointerId,
    };
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = swipeStartRef.current;
    swipeStartRef.current = null;

    if (!start || start.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;

    if (Math.abs(deltaX) < SWIPE_THRESHOLD) {
      return;
    }

    if (Math.abs(deltaX) <= Math.abs(deltaY)) {
      return;
    }

    navigate(deltaX > 0 ? -1 : 1);
  };

  const handlePointerCancel = () => {
    swipeStartRef.current = null;
  };

  const renderDay = (date: Date, outside = false) => (
    <DayCell
      date={date}
      selected={startDate ? isSameDay(date, startDate) : false}
      inRange={
        startDate && endDate
          ? !isBeforeDay(date, startDate) && !isBeforeDay(endDate, date)
          : false
      }
      outside={outside}
      disabled={isBeforeDay(date, min)}
      hasEvent={eventDayKeys.has(startOfDay(date).getTime())}
      tabIndex={isSameDay(date, focusedDate) ? 0 : -1}
      onSelect={selectDay}
      onKeyDown={handleDayKeyDown}
      buttonRef={(element) => registerDayRef(date, element)}
    />
  );

  const viewKey =
    view === "week"
      ? `week-${startOfWeek(cursor).getTime()}`
      : `month-${cursor.getFullYear()}-${cursor.getMonth()}`;

  return (
    <div className="date-widget" id="viaje-fechas" tabIndex={-1}>
      <DurationChips
        durations={durationOptions}
        value={duration}
        onChange={handleDurationChange}
      />

      <div className="date-widget__card">
        <ViewToggle view={view} onChange={setView} />

        <header className="date-widget__header">
          <button
            type="button"
            className="date-widget__nav"
            aria-label={view === "week" ? "Semana anterior" : "Mes anterior"}
            onClick={() => navigate(-1)}
            disabled={!canNavigatePrev}
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>

          <h3 className="date-widget__month">{formatMonthYear(cursor)}</h3>

          <span className="date-widget__selected-day">
            {startDate ? startDate.getDate() : cursor.getDate()}
          </span>

          <button
            type="button"
            className="date-widget__nav"
            aria-label={
              view === "week" ? "Semana siguiente" : "Mes siguiente"
            }
            onClick={() => navigate(1)}
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </header>

        <div
          className="date-widget__calendar"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
        >
          {view === "week" ? (
            <WeekView key={viewKey} cursor={cursor} renderDay={renderDay} />
          ) : (
            <MonthView key={viewKey} cursor={cursor} renderDay={renderDay} />
          )}
        </div>

        <p className="date-widget__status" aria-live="polite">
          {formatRangeSummary(startDate, endDate)}
        </p>
      </div>
    </div>
  );
}

const KEYBOARD_OFFSETS: Record<string, number> = {
  ArrowLeft: -1,
  ArrowRight: 1,
  ArrowUp: -7,
  ArrowDown: 7,
};

function normalizeValue(value: Date | null, min: Date): Date | null {
  if (!value) {
    return null;
  }

  const day = startOfDay(value);

  return isBeforeDay(day, min) ? null : day;
}

function firstEnabledDayInWeek(cursor: Date, min: Date): Date {
  const weekStart = startOfWeek(cursor);

  for (let index = 0; index < 7; index += 1) {
    const day = addDays(weekStart, index);

    if (!isBeforeDay(day, min)) {
      return day;
    }
  }

  return min;
}

function firstEnabledDayInMonth(cursor: Date, min: Date): Date {
  const monthStart = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const gridStart = startOfWeek(monthStart);

  for (let index = 0; index < 42; index += 1) {
    const day = addDays(gridStart, index);

    if (
      day.getFullYear() === cursor.getFullYear() &&
      day.getMonth() === cursor.getMonth() &&
      !isBeforeDay(day, min)
    ) {
      return day;
    }
  }

  return monthStart;
}

export default DateRangeWidget;
