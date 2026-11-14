import type { BarrioCaba, OrigenLugar } from "../api/types";

const BARRIO_LABELS: Record<BarrioCaba, string> = {
  Palermo: "Palermo",
  Recoleta: "Recoleta",
  SanTelmo: "San Telmo",
  SanNicolas: "San Nicolás",
  PuertoMadero: "Puerto Madero",
};

export function barrioLabel(barrio: BarrioCaba): string {
  return BARRIO_LABELS[barrio] ?? barrio;
}

export function precioLabel(nivel: number): string {
  return "$".repeat(Math.max(1, Math.min(3, nivel)));
}

export function origenLabel(origen: OrigenLugar): string {
  return origen === "CuradoLocal" ? "Catálogo Curado" : "Google Places";
}

export function formatearPuntuacion(puntuacion: number | null): string | null {
  if (puntuacion == null) return null;
  return puntuacion.toFixed(1);
}

export function capitalize(string: string) {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getHourAndMinutes(date: Date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
}