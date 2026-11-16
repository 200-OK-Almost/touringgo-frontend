import type { BarrioCaba, CategoriaDto } from "../../api/types";
import type { TipoTransporte } from "../profile/types";
import type { NivelPresupuesto } from "../viaje/types";
import type {
  DisponibilidadDiaria,
  ModalidadViaje,
  PuntoInicio,
  RitmoCaminata,
} from "./types";

export interface ItineraryFormData {
  barrio: BarrioCaba | null;
  puntoInicio: PuntoInicio | null;
  hospedajeLugarGuid: string | null;
  hospedajeBarrio: BarrioCaba | null;

  cantidadDias: number | null;
  disponibilidadDiaria: DisponibilidadDiaria | null;

  modalidadViaje: ModalidadViaje | null;

  categoriasPrioritarias: CategoriaDto[];

  ritmoVisita: RitmoCaminata | null;
  presupuestoNivel: NivelPresupuesto | null;
  tipoTransporte: TipoTransporte | null;
}

export function crearItineraryFormDataInicial(): ItineraryFormData {
  return {
    barrio: null,
    puntoInicio: null,
    hospedajeLugarGuid: null,
    hospedajeBarrio: null,

    cantidadDias: null,
    disponibilidadDiaria: null,
    modalidadViaje: null,
    categoriasPrioritarias: [],
    ritmoVisita: null,
    tipoTransporte: null,
    presupuestoNivel: null,
  };
}
