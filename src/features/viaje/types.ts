import type { BarrioCaba, LugarDetalleDto } from "../../api/types"
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
  fechaCreacion: string
  fechaActualizacion: string
  categoriaCodigos: string[]
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

