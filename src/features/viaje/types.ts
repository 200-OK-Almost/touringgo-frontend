import type { BarrioCaba } from "../../api/types"
import type { DisponibilidadDiaria, ModalidadViaje, PuntoInicio } from "../itinerarios/types"
import type { RitmoVisita } from "../profile/types"

export type ViajeDto = {
  id: string
  titulo: string 
  tipoViaje: ModalidadViaje  
  estado: EstadoViaje  
  barrio: BarrioCaba  
  alcanceTemporal: DisponibilidadDiaria
  fechaInicio: Date
  fechaFin: Date
  nivelPresupuesto: NivelPresupuesto
  ritmoCaminata: RitmoVisita
  limiteCuadrasEntreParadas: number
  tipoPuntoPartida: PuntoInicio
  lugarPartidaId?: string
  nombrePuntoPartida?: string
  direccionPartida?: string
  latitudPartida?: number
  longitudPartida?: number
  codigoInvitacion: string
  creadoPorUsuarioId: string
  fechaCreacion: Date
  fechaActualizacion: Date
  categoriaCodigos: string[]
  parametrosFamilia?: ParametrosFamiliaDto
  itinerarios: ItinerarioDto[]
}

export type ItinerarioDto = {
  id: string
  viajeId: string
  numeroDia: number
  fecha: Date
  tipoPuntoInicio: PuntoInicio
  origenDescripcion: string
  origenLatitud: number
  origenLongitud: number
  paradas: ParadaItinerarioDto[]
}

export type ParadaItinerarioDto = {
  id: string
  viajeId: string
  lugarId: string
  turno: Turno
  ordenParada: number
  horaInicio: Date
  duracionMinutos: number
  distanciaMetrosDesdeAnterior?: number
  cuadrasDesdeAnterior?: number
  minutosAPieDesdeAnterior?: number
  origenParada: OrigenParada
  sugerenciaIa?: string 
  notasPersonales?: string
}

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

export type Turno = 
  | "Manana"
  | "Tarde"
  | "Noche"

export type OrigenParada = 
  | "Ia"
  | "Refinamiento"
  | "SugerenciaHueco"
  | "Manua"
