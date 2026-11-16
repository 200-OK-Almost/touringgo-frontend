// Temporal hasta definir
export type PuntoInicio =
  | "HospedajeSugerido"
  | "NodoUrbano" // "de paso"
  | "HospedajePropio"
  | "PrimeraParada"

// export type DisponibilidadDiaria =
//   "diaCompleto"
//   | "mañana"
//   | "tarde"
//   | "noche"

export type DisponibilidadDiaria =
  "DiaCompleto"
  | "TardeNoche"
  | "MananaAlmuerzo"

export type ModalidadViaje =
  "Solo"
  | "Grupo"
  | "Pareja"
  | "Familia"

export type RitmoCaminata =
  "Tranquilo"
  | "Moderado"
  | "Activo"
