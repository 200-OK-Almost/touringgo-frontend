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
  id: string;
  nombre: string;
  tipoLugar: TipoLugar;
  barrio: BarrioCaba;
  subzona: string | null;
  direccion: string;
  latitud: number;
  longitud: number;
  duracionEstimadaMinutos: number;
  nivelPrecio: number;
  puntuacion: number | null;
  cantidadResenas: number;
  esBajoTecho: boolean;
  esAlAireLibre: boolean;
  aptoNinos: boolean;
  accesibleMovilidadReducida: boolean;
  fotoPortadaUrl: string | null;
  categorias: string[];
  distanciaMetros: number | null;
}

export interface CategoriaDto {
  id: number;
  codigo: string;
  nombre: string;
}

export interface FotoDto {
  id: string;
  url: string;
  orden: number;
  esPortada: boolean;
}

export interface ResenaDto {
  id: string;
  autorNombre: string | null;
  puntuacion: number;
  comentario: string | null;
  fechaResena: string | null;
}

export interface LugarDetalleDto {
  id: string;
  origen: OrigenLugar;
  idGooglePlace: string | null;
  tipoLugar: TipoLugar;
  nombre: string;
  barrio: BarrioCaba;
  subzona: string | null;
  direccion: string;
  latitud: number;
  longitud: number;
  descripcion: string | null;
  duracionEstimadaMinutos: number;
  nivelPrecio: number;
  puntuacion: number | null;
  cantidadResenas: number;
  esBajoTecho: boolean;
  esAlAireLibre: boolean;
  aptoNinos: boolean;
  accesibleMovilidadReducida: boolean;
  ofreceMenuInfantil: boolean;
  categorias: CategoriaDto[];
  opcionesDietarias: string[];
  fotos: FotoDto[];
  resenas: ResenaDto[];
}

export interface ControlCuotaGoogleDto {
  fecha: string;
  llamadasRealizadas: number;
  limiteDiario: number;
  circuitoAbierto: boolean;
  llamadasDisponibles: number;
  fechaActualizacion: string;
}

export interface ResultadoPaginadoDto<T> {
  items: T[];
  total: number;
  pagina: number;
  tamano: number;
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
