import type { BarrioCaba, CategoriaCodigo, LugarDetalleDto } from "../../api/types"
import type { DisponibilidadDiaria, ModalidadViaje, PuntoInicio, RitmoCaminata } from "../itinerarios/types"

export type ViajeDiaDto = {
  id: string
  viajeId: string
  numeroDia: number
  fecha: string | null
  barrio: BarrioCaba
  tipoPuntoPartida: PuntoInicio
  lugarPartidaId?: string
  nombrePuntoPartida?: string
  direccionPartida?: string
  latitudPartida?: number
  longitudPartida?: number
  tipoViaje?: ModalidadViaje | null
  categoriaCodigos?: string[]
}

export type ViajeDto = {
  id: string
  titulo: string 
  tipoViaje: ModalidadViaje  
  estado: EstadoViaje  
  barrio: BarrioCaba  
  alcanceTemporal: DisponibilidadDiaria
  fechaInicio: string | null
  fechaFin: string | null
  nivelPresupuesto: NivelPresupuesto
  ritmoCaminata: RitmoCaminata
  limiteCuadrasEntreParadas: number | null
  tipoPuntoPartida: PuntoInicio
  lugarPartidaId?: string
  nombrePuntoPartida?: string
  direccionPartida?: string
  latitudPartida?: number
  longitudPartida?: number
  codigoInvitacion: string
  creadoPorUsuarioId: string
  puedeEditar?: boolean
  fechaCreacion: string
  fechaActualizacion: string
  categoriaCodigos: CategoriaCodigo[]
  dias?: ViajeDiaDto[] | null
  parametrosFamilia?: ParametrosFamiliaDto
  itinerarios: ItinerarioDto[] | null
}

export type ItinerarioDto = {
  id: string
  viajeId: string
  numeroDia: number
  fecha: string | null
  origenTipo: PuntoInicio
  origenDescripcion: string | null
  origenLatitud: number | null
  origenLongitud: number | null
  version: string | null
  paradas: ParadaItinerarioDto[]
}

export type ParadaItinerarioDto = {
  id: string
  lugarId: string
  turno: Turno
  ordenParada: number
  horaInicio: string | null
  duracionMinutos: number | null
  distanciaMetrosDesdeAnterior?: number
  cuadrasDesdeAnterior?: number
  minutosAPieDesdeAnterior?: number
  origenParada: OrigenParada
  sugerenciaIa?: string 
  notasPersonales?: string
}

export type ParadaViewModel = {
    parada: ParadaItinerarioDto;
    lugar: LugarDetalleDto;
};

export type ItinerarioViewModel = {
    itinerario: ItinerarioDto;
    paradas: ParadaViewModel[];
};

export type ParametrosFamiliaDto = {
  cantidadAcompanantes: number
  hayNinos: boolean
  cantidadNinos: number
  movilidadReducida: boolean
  requiereRitmoBajo: boolean
  requiereMenuInfantil: boolean
}

export type NivelPresupuesto = 
  | "Economico"
  | "Equilibrado"
  | "SinRestricciones"

export type EstadoViaje = 
  | "Borrador"
  | "Planificado"
  | "Finalizado"
  | "EnPlanificacion"

export type Turno = 
  | "Manana"
  | "Mediodia"
  | "Tarde"
  | "Noche"

export type OrigenParada = 
  | "Ia"
  | "Refinamiento"
  | "SugerenciaHueco"
  | "Manual"


export type ViajeUpdateDto = {
  titulo: string
  tipoViaje: ModalidadViaje
  estado: EstadoViaje
  barrio: BarrioCaba
  alcanceTemporal: DisponibilidadDiaria
  fechaInicio: string | null
  fechaFin: string | null
  nivelPresupuesto: NivelPresupuesto
  ritmoCaminata: RitmoCaminata
  limiteCuadrasEntreParadas: number | null
  tipoPuntoPartida: PuntoInicio
  lugarPartidaId?: string
  nombrePuntoPartida?: string
  direccionPartida?: string
  latitudPartida?: number
  longitudPartida?: number
  categoriaCodigos: string[]
  parametrosFamilia?: ParametrosFamiliaDto
}

export type ViajeDiaCreateDto = {
  numeroDia: number
  fecha: string
  barrio: BarrioCaba
  tipoPuntoPartida: PuntoInicio
  lugarPartidaId?: string
  nombrePuntoPartida?: string
  direccionPartida?: string
  latitudPartida?: number
  longitudPartida?: number
  tipoViaje: ModalidadViaje
  categoriaCodigos: string[]
}

export type ViajeCreateDto = {
  titulo: string
  tipoViaje: ModalidadViaje
  barrio: BarrioCaba
  alcanceTemporal: DisponibilidadDiaria
  fechaInicio: string
  fechaFin: string
  nivelPresupuesto: NivelPresupuesto
  ritmoCaminata: RitmoCaminata
  limiteCuadrasEntreParadas?: number
  tipoPuntoPartida: PuntoInicio
  lugarPartidaId?: string
  nombrePuntoPartida?: string
  direccionPartida?: string
  latitudPartida?: number
  categoriaCodigos: string[]
  dias?: ViajeDiaCreateDto[]
  parametrosFamilia?: ParametrosFamiliaDto
}

export type MensajeHistorialDto = {
  rol: "user" | "assistant"
  contenido: string
}

export type AsistenteRequestDto = {
  mensaje: string
  numeroDia?: number | null
  historial?: MensajeHistorialDto[]
}

export type RecomendacionLugarDto = {
  lugarId: string
  nombre: string
  descripcion: string | null
  direccion: string | null
  barrio: BarrioCaba
  subzona: string | null
  latitud: number
  longitud: number
  puntuacion: number | null
  cantidadResenas: number
  nivelPrecio: number
  duracionMinutos: number
  esAireLibre: boolean
  esBajoTecho: boolean
  aptoNinos: boolean
  accesible: boolean
  fotoPortadaUrl: string | null
  categorias: string[]
  opcionesDietarias: string[]
  similitud: number
  motivo: string
}

export type OpcionAclaracionDto = {
  id: string
  etiqueta: string
}

export type AclaracionDto = {
  pregunta: string
  opciones: OpcionAclaracionDto[]
}

export type AccionPropuestaDto = {
  tipo: "AgregarParada" | "ReemplazarParada"
  numeroDia: number
  lugarId: string
  paradaId: string | null
  turno: Turno | null
  version: string
}

export type AplicarAccionAsistenteDto = AccionPropuestaDto

export type AsistenteResponseDto = {
  mensaje: string
  puedeAplicar: boolean
  recomendaciones: RecomendacionLugarDto[]
  accion: AccionPropuestaDto | null
  aclaracion: AclaracionDto | null
  advertencia: string | null
}

export type AsistenteLimitesDto = {
  topK: number
  minResultados: number
  maxMensajeCaracteres: number
  maxHistorial: number
  rateLimitPorUsuario: number
  rateLimitPorViaje: number
  ventanaRateLimitSegundos: number
}

export type AsistenteCapacidadesDto = {
  habilitado: boolean
  limites: AsistenteLimitesDto
}

