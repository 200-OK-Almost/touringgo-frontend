import type { BarrioCaba, CategoriaDto } from "../../api/types";
import type { TipoTransporte } from "../profile/types";
import type { NivelPresupuesto } from "../viaje/types";
import type {
  DisponibilidadDiaria,
  ModalidadViaje,
  PuntoInicio,
  RitmoCaminata,
} from "./types";

export interface DiaPlanificacion {
  fecha: string;
  dia: number;
  barrio: BarrioCaba | null;
  puntoInicio: PuntoInicio | null;
  hospedajeLugarGuid: string | null;
  hospedajeBarrio: BarrioCaba | null;
  modalidadViaje: ModalidadViaje | null;
  categoriasPrioritarias: CategoriaDto[];
}

export interface ItineraryFormData {
  duracion: number;
  dias: DiaPlanificacion[];

  fechaInicio: string | null;
  fechaFin: string | null;
  disponibilidadDiaria: DisponibilidadDiaria | null;

  ritmoVisita: RitmoCaminata | null;
  presupuestoNivel: NivelPresupuesto | null;
  tipoTransporte: TipoTransporte | null;
}

export function crearItineraryFormDataInicial(): ItineraryFormData {
  return {
    duracion: 0,
    dias: [],

    fechaInicio: null,
    fechaFin: null,
    disponibilidadDiaria: null,
    ritmoVisita: null,
    tipoTransporte: null,
    presupuestoNivel: null,
  };
}
