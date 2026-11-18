import type { BarrioCaba, CategoriaCodigo, OrigenLugar } from "../api/types";
import type { NivelPresupuesto } from "../features/viaje/types";

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

const PRESUPUESTO_LABELS: Record<NivelPresupuesto, string> = {
  Economico: "Economico",
  Equilibrado: "Equilibrado",
  SinRestricciones: "Sin restricciones",
};

export function presupuestoLabel(presupuesto: NivelPresupuesto) {
  return PRESUPUESTO_LABELS[presupuesto] ?? presupuesto;
}

const CATEGORIA_CODIGOS: Record<CategoriaCodigo, string> = {
  cafe_especialidad: "Café de especialidad",
  museos_galerias: "Museos y galerías",
  parques_aire_libre: "Parques y aire libre",
  librerias_diseno: "Librerías y diseño",
  bares_vermu: "Bares y vermú",
  gastronomia_clasica: "Gastronomía clásica/Bodegón",
  cocteleria_autor: "Coctelería de autor",
};

export function categoriaLabel(categoriaCodigo: CategoriaCodigo) {
  return CATEGORIA_CODIGOS[categoriaCodigo] ?? categoriaCodigo;
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

export function getDayAndMonth(date: Date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');

  return `${day}/${month}`
}

export function toDateOnlyString(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}