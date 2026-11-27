import type { CategoriaDto } from "../../../api/types";
import type { NivelPresupuesto } from "../../viaje/types";
import type { FormErrors } from "../PlanificationForm.validation";
import type { DiaPlanificacion } from "../planificacionFormData";
import type { RitmoCaminata } from "../types";
import TravelCompanionsAndInterestsStep from "./TravelCompanionsAndInterestsStep";
import TravelStyleStep from "./TravelStyleStep";

interface InteresesYEstiloStepProps {
  dias: DiaPlanificacion[];
  categorias: CategoriaDto[];
  onChangeDia: (
    diaNumero: number,
    changes: Partial<DiaPlanificacion>
  ) => void;
  ritmoVisita: RitmoCaminata | null;
  presupuestoNivel: NivelPresupuesto | null;
  onChange: (changes: {
    ritmoVisita?: RitmoCaminata | null;
    presupuestoNivel?: NivelPresupuesto | null;
  }) => void;
  errors: FormErrors;
}

function InteresesYEstiloStep({
  dias,
  categorias,
  onChangeDia,
  ritmoVisita,
  presupuestoNivel,
  onChange,
  errors,
}: InteresesYEstiloStepProps) {
  return (
    <>
      <TravelCompanionsAndInterestsStep
        dias={dias}
        categorias={categorias}
        onChangeDia={onChangeDia}
        errors={errors}
      />
      <TravelStyleStep
        ritmoVisita={ritmoVisita}
        presupuestoNivel={presupuestoNivel}
        onChange={onChange}
        errors={errors}
      />
    </>
  );
}

export default InteresesYEstiloStep;
