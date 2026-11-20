const MS_PER_DAY = 24 * 60 * 60 * 1000;
const LOCALE = "es-AR";

export const WEEKDAY_INITIALS = ["L", "M", "M", "J", "V", "S", "D"] as const;

export interface MonthGridCell {
  date: Date;
  inCurrentMonth: boolean;
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

export function startOfWeek(date: Date): Date {
  const day = startOfDay(date);
  const mondayOffset = (day.getDay() + 6) % 7;

  return addDays(day, -mondayOffset);
}

export function isSameDay(a: Date, b: Date): boolean {
  return toDayNumber(a) === toDayNumber(b);
}

export function isBeforeDay(a: Date, b: Date): boolean {
  return toDayNumber(a) < toDayNumber(b);
}

export function countDaysInclusive(start: Date, end: Date): number {
  return Math.round((toDayNumber(end) - toDayNumber(start)) / MS_PER_DAY) + 1;
}

export function getWeekDays(cursor: Date): Date[] {
  const monday = startOfWeek(cursor);

  return Array.from({ length: 7 }, (_, index) => addDays(monday, index));
}

export function getMonthGrid(year: number, month: number): MonthGridCell[] {
  const gridStart = startOfWeek(new Date(year, month, 1));

  return Array.from({ length: 42 }, (_, index) => {
    const date = addDays(gridStart, index);

    return {
      date,
      inCurrentMonth:
        date.getFullYear() === year && date.getMonth() === month,
    };
  });
}

export function formatMonthName(date: Date): string {
  const month = new Intl.DateTimeFormat(LOCALE, { month: "long" }).format(date);

  return capitalize(month);
}

export function formatMonthYear(date: Date): string {
  return `${formatMonthName(date)} ${date.getFullYear()}`;
}

export function formatFullDate(date: Date): string {
  return new Intl.DateTimeFormat(LOCALE, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
    .format(date)
    .replace(",", "");
}

export function formatShortDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${day}/${month}`;
}

export function formatRangeSummary(
  start: Date | null,
  end: Date | null
): string {
  if (!start) {
    return "Elegí la fecha de inicio";
  }

  if (!end) {
    return "Elegí la fecha de fin";
  }

  const days = countDaysInclusive(start, end);

  if (days < 1) {
    return "El rango de fechas no es válido";
  }

  const from = formatShortDate(start);
  const to = formatShortDate(end);

  return days === 1
    ? `El ${from} · 1 día`
    : `Del ${from} al ${to} · ${days} días`;
}

function toDayNumber(date: Date): number {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
