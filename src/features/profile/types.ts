export interface UsuarioDTO {
  id: string;
  email: string;
  nombre: string;
  fotoUrl: string | null;
  fechaCreacion: string;
  ultimoAcceso: string;
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
  categoriaId: string;
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

export interface PerfilUsuarioDTO {
  usuario: UsuarioDTO;
  preferencias: PreferenciasUsuarioDTO;
  restricciones: RestriccionesUsuarioDTO;
}
