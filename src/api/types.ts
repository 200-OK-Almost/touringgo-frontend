export type BarrioCaba =
  | "Palermo"
  | "Recoleta"
  | "SanTelmo"
  | "SanNicolas"
  | "PuertoMadero";

export type TipoLugar = "PuntoInteres" | "Alojamiento" | "NodoUrbano";

export type OrigenLugar = "CuradoLocal" | "GooglePlaces";

export type RestriccionDietaria =
  | "Celiaco"
  | "Vegano"
  | "Vegetariano"
  | "IntoleranteLactosa";

export interface LugarResumenDto {
  Id: string;
  Nombre: string;
  TipoLugar: TipoLugar;
  Barrio: BarrioCaba;
  Subzona: string | null;
  Direccion: string;
  Latitud: number;
  Longitud: number;
  DuracionEstimadaMinutos: number;
  NivelPrecio: number;
  Puntuacion: number | null;
  CantidadResenas: number;
  EsBajoTecho: boolean;
  EsAlAireLibre: boolean;
  AptoNinos: boolean;
  AccesibleMovilidadReducida: boolean;
  FotoPortadaUrl: string | null;
  Categorias: string[];
  DistanciaMetros: number | null;
}

export interface CategoriaDto {
  Id: number;
  Codigo: string;
  Nombre: string;
}

export interface FotoDto {
  Id: string;
  Url: string;
  Orden: number;
  EsPortada: boolean;
}

export interface ResenaDto {
  Id: string;
  AutorNombre: string | null;
  Puntuacion: number;
  Comentario: string | null;
  FechaResena: string | null;
}

export interface LugarDetalleDto {
  Id: string;
  Origen: OrigenLugar;
  IdGooglePlace: string | null;
  TipoLugar: TipoLugar;
  Nombre: string;
  Barrio: BarrioCaba;
  Subzona: string | null;
  Direccion: string;
  Latitud: number;
  Longitud: number;
  Descripcion: string | null;
  DuracionEstimadaMinutos: number;
  NivelPrecio: number;
  Puntuacion: number | null;
  CantidadResenas: number;
  EsBajoTecho: boolean;
  EsAlAireLibre: boolean;
  AptoNinos: boolean;
  AccesibleMovilidadReducida: boolean;
  OfreceMenuInfantil: boolean;
  Categorias: CategoriaDto[];
  OpcionesDietarias: string[];
  Fotos: FotoDto[];
  Resenas: ResenaDto[];
}

export interface ControlCuotaGoogleDto {
  Fecha: string;
  LlamadasRealizadas: number;
  LimiteDiario: number;
  CircuitoAbierto: boolean;
  LlamadasDisponibles: number;
  FechaActualizacion: string;
}

export interface ResultadoPaginadoDto<T> {
  Items: T[];
  Total: number;
  Pagina: number;
  Tamano: number;
}

export interface LugarFiltro {
  barrio?: BarrioCaba;
  categoriaCodigo?: string;
  soloBajoTecho?: boolean;
  soloAlAireLibre?: boolean;
  aptoNinos?: boolean;
  accesibleMovilidadReducida?: boolean;
  busqueda?: string;
  pagina?: number;
  tamano?: number;
}
