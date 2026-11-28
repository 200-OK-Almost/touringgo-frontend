import type {
  BarrioCaba,
  CategoriaCodigo,
  LugarOrden,
  LugarResumenDto,
} from "../../api/types";

export interface SlotItinerario {
  categoriaCodigo?: CategoriaCodigo;
  orden?: LugarOrden;
  resenasMinimas?: number;
  puntuacionMinima?: number;
}

export interface TemaItinerario {
  id: string;
  titulo: string;
  descripcion: string;
  barrio: BarrioCaba;
  subzona?: string;
  categoriaCodigo?: CategoriaCodigo;
  orden: LugarOrden;
  resenasMinimas: number;
  puntuacionMinima: number;
  icono: string;
  slots?: SlotItinerario[];
}

export interface ItinerarioDestacado {
  tema: TemaItinerario;
  lugares: LugarResumenDto[];
  promedioPuntuacion: number | null;
  portadaUrl: string | null;
}
