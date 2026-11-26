import type { CategoriaCodigo } from "../../api/types";

export interface UsuarioDTO {
  id: string;
  email: string;
  nombre: string;
  fotoUrl: string | null;
  fechaCreacion: string;
  ultimoAcceso: string;
  completoEncuesta: boolean;
}

export type RitmoVisita = "Relajado" | "Moderado" | "Activo";

export type TipoTransporte =
  | "Caminando"
  | "TransportePublico"
  | "VehiculoPersonal";

export type TipoDieta =
  | "Celiaco"
  | "Vegetariano"
  | "Vegano"
  | "IntoleranteLactosa";

export interface PreferenciasCategoriaDTO {
  id: string;
  categoriaCodigo: string;
  afinidad: number;
}

export interface PreferenciasUsuarioDTO {
  id: string;
  ritmoVisitaPreferido: RitmoVisita;
  transportesPreferidos: TipoTransporte[];
  categorias: PreferenciasCategoriaDTO[];
}

export interface ActualizarPreferenciasUsuarioDTO {
  ritmoVisitaPreferido?: RitmoVisita;
  transportesPreferidos?: TipoTransporte[];
  categorias: ActualizarPreferenciasCategoriaDTO[]
}

export interface RestriccionesUsuarioDTO {
  id: string;
  dieta: TipoDieta[];
  requiereRecorridoSinEscalones: boolean;
  requiereBanoAccesible: boolean;
}

export interface ActualizarRestriccionesUsuarioDTO {
  dieta?: TipoDieta[];
  requiereRecorridoSinEscalones?: boolean;
  requiereBanoAccesible?: boolean;
}

export interface ActualizarPreferenciasCategoriaDTO {
  categoriaCodigo: CategoriaCodigo
  afinidad: number
}

export interface PerfilUsuarioDTO {
  usuario: UsuarioDTO;
  preferencias: PreferenciasUsuarioDTO;
  restricciones: RestriccionesUsuarioDTO;
}
