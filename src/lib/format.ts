import { createElement, type ReactNode } from "react";
import type { BarrioCaba, CategoriaCodigo, OrigenLugar } from "../api/types";
import type { NivelPresupuesto } from "../features/viaje/types";
import {
  IoBeerOutline,
  IoCafeOutline,
  IoColorPaletteOutline,
  IoLeafOutline,
  IoLibraryOutline,
  IoPizzaOutline,
  IoWineOutline,
} from "react-icons/io5";

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

const CATEGORIA_CODIGOS: Record<string, string> = {
  cafe_especialidad: "Café de especialidad",
  museos_galerias: "Museos y galerías",
  parques_aire_libre: "Parques y aire libre",
  librerias_diseno: "Librerías y diseño",
  bares_vermu: "Bares y vermú",
  gastronomia_clasica: "Gastronomía clásica",
  cocteleria_autor: "Coctelería de autor",
  alojamiento: "Alojamiento / Hotel",
  hotel: "Hotel / Alojamiento",
};

export function categoriaLabel(categoriaCodigo?: string | null): string {
  if (!categoriaCodigo) return "Punto de interés";
  if (CATEGORIA_CODIGOS[categoriaCodigo]) {
    return CATEGORIA_CODIGOS[categoriaCodigo];
  }
  return categoriaCodigo
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const ICON_MAP: Record<CategoriaCodigo, ReactNode> = {
  cafe_especialidad: createElement(IoCafeOutline),
  museos_galerias: createElement(IoColorPaletteOutline),
  parques_aire_libre: createElement(IoLeafOutline),
  librerias_diseno: createElement(IoLibraryOutline),
  bares_vermu: createElement(IoBeerOutline),
  gastronomia_clasica: createElement(IoPizzaOutline),
  cocteleria_autor: createElement(IoWineOutline),
};
export function getCategoriaIcon(categoriaCodigo: CategoriaCodigo) {
  return ICON_MAP[categoriaCodigo];
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