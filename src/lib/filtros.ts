import type { BarrioCaba, LugarFiltro } from "../api/types";

export interface ChipOption<T extends string> {
  value: T;
  label: string;
}

export type FiltroPanel = Omit<LugarFiltro, "pagina" | "tamano">;

export const FILTRO_INICIAL: FiltroPanel = {};

export const BARRIOS: readonly ChipOption<BarrioCaba>[] = [
  { value: "Palermo", label: "Palermo" },
  { value: "Recoleta", label: "Recoleta" },
  { value: "SanTelmo", label: "San Telmo" },
  { value: "SanNicolas", label: "San Nicolás" },
  { value: "PuertoMadero", label: "Puerto Madero" },
];

export const CATEGORIAS: readonly ChipOption<string>[] = [
  { value: "bares_vermu", label: "Bares y vermú" },
  { value: "cafe_especialidad", label: "Café de especialidad" },
  { value: "cocteleria_autor", label: "Coctelería de autor" },
  { value: "gastronomia_clasica", label: "Gastronomía clásica/Bodegón" },
  { value: "librerias_diseno", label: "Librerías y diseño" },
  { value: "museos_galerias", label: "Museos y galerías" },
  { value: "parques_aire_libre", label: "Parques y aire libre" },
];
