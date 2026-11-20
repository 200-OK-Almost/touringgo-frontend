import { useState } from "react";
import {
  IoBeerOutline,
  IoCafeOutline,
  IoColorPaletteOutline,
  IoLeafOutline,
  IoLibraryOutline,
  IoPeople,
  IoPeopleOutline,
  IoPersonOutline,
  IoPizzaOutline,
  IoWineOutline,
} from "react-icons/io5";
import { SelectableCard } from "../../../components/SelectableCard";
import type { CategoriaDto } from "../../../api/types";
import type { FormErrors } from "../PlanificationForm.validation";
import type { DiaPlanificacion } from "../planificacionFormData";
import type { ModalidadViaje } from "../types";
import DaySelectorTabs from "../components/DaySelectorTabs";
import { preferenciasDiaCompletas } from "../lib/diasPlanificacion";

interface TravelCompanionsAndInterestsStepProps {
  dias: DiaPlanificacion[];
  categorias: CategoriaDto[];
  onChangeDia: (
    diaNumero: number,
    changes: Partial<DiaPlanificacion>
  ) => void;
  errors: FormErrors;
}

type ModalidadViajeOption = {
  title: string;
  description: string;
  icon: React.ReactNode;
  value: ModalidadViaje;
};

type CategoriaOption = {
  title: string;
  icon: React.ReactNode;
  value: CategoriaDto;
};

interface PreferenceFieldsProps {
  dia: DiaPlanificacion | null;
  categorias: CategoriaDto[];
  onChange: (changes: Partial<DiaPlanificacion>) => void;
  errorModalidad?: string;
  errorCategorias?: string;
}

const MODALIDAD_OPTIONS: ModalidadViajeOption[] = [
  {
    title: "Solo",
    value: "Solo",
    description: "Un recorrido pensado para disfrutar a tu propio ritmo",
    icon: <IoPersonOutline />,
  },
  {
    title: "Con Grupo",
    value: "Amigos",
    description: "Propuestas para disfrutar en grupo",
    icon: <IoPeopleOutline />,
  },
  {
    title: "Con familia",
    value: "Familia",
    description: "Actividades para las necesidades de los distintos integrantes",
    icon: <IoPeople />,
  },
];

const ICON_MAP: { [key: string]: React.ReactNode } = {
  cafe_especialidad: <IoCafeOutline />,
  museos_galerias: <IoColorPaletteOutline />,
  parques_aire_libre: <IoLeafOutline />,
  librerias_diseno: <IoLibraryOutline />,
  bares_vermu: <IoBeerOutline />,
  gastronomia_clasica: <IoPizzaOutline />,
  cocteleria_autor: <IoWineOutline />,
};

function PreferenceFields({
  dia,
  categorias,
  onChange,
  errorModalidad,
  errorCategorias,
}: PreferenceFieldsProps) {
  const modalidadViaje = dia?.modalidadViaje ?? null;
  const categoriasPrioritarias = dia?.categoriasPrioritarias ?? [];

  const categoriaOptions: CategoriaOption[] = categorias.map((categoria) => ({
    title: categoria.nombre,
    value: categoria,
    icon: ICON_MAP[categoria.codigo],
  }));

  return (
    <>
      <div className="planificacion-form-header">
        <h2>Modalidad de viaje</h2>
      </div>
      <div className="selectable-card-group grid-3">
        {MODALIDAD_OPTIONS.map((modalidad) => (
          <SelectableCard
            key={modalidad.value}
            title={modalidad.title}
            icon={modalidad.icon}
            selected={modalidadViaje === modalidad.value}
            description={modalidad.description}
            onClick={() => onChange({ modalidadViaje: modalidad.value })}
            variant="big"
          />
        ))}
      </div>
      {errorModalidad && (
        <div className="planificacion-field-error">
          <p>{errorModalidad}</p>
        </div>
      )}

      <div className="planificacion-form-header">
        <h2>Categorías de interés</h2>
        <p className="planificacion-form-description text-muted">
          Elegí entre 2 y 4 categorías · {categoriasPrioritarias.length}{" "}
          Seleccionadas
        </p>
      </div>
      <div className="selectable-card-group grid-auto">
        {categoriaOptions.map((categoria) => (
          <SelectableCard
            key={categoria.value.id ?? categoria.title}
            title={categoria.title}
            icon={categoria.icon}
            selected={categoriasPrioritarias.some(
              (seleccionada) => seleccionada.id === categoria.value.id
            )}
            variant="big"
            selectionIndicator="checkbox"
            onClick={() => {
              const yaSeleccionada = categoriasPrioritarias.some(
                (seleccionada) => seleccionada.id === categoria.value.id
              );
              const nuevasCategorias = yaSeleccionada
                ? categoriasPrioritarias.filter(
                    (seleccionada) => seleccionada.id !== categoria.value.id
                  )
                : [...categoriasPrioritarias, categoria.value];

              onChange({ categoriasPrioritarias: nuevasCategorias });
            }}
          />
        ))}
      </div>
      {errorCategorias && (
        <div className="planificacion-field-error">
          <p>{errorCategorias}</p>
        </div>
      )}
    </>
  );
}

function TravelCompanionsAndInterestsStep({
  dias,
  categorias,
  onChangeDia,
  errors,
}: TravelCompanionsAndInterestsStepProps) {
  const [diaActivo, setDiaActivo] = useState(1);
  const esUnDia = dias.length <= 1;
  const diaSeleccionado = dias.some((dia) => dia.dia === diaActivo)
    ? diaActivo
    : dias[0]?.dia ?? 1;
  const dia = dias.find((item) => item.dia === diaSeleccionado) ?? null;
  const primerDia = dias[0];
  const puedeCopiarPreferencias = Boolean(
    primerDia?.modalidadViaje ||
      (primerDia?.categoriasPrioritarias.length ?? 0) > 0
  );

  function aplicarMismasPreferencias() {
    if (!primerDia) {
      return;
    }

    dias.slice(1).forEach((diaRestante) => {
      onChangeDia(diaRestante.dia, {
        modalidadViaje: primerDia.modalidadViaje,
        categoriasPrioritarias: primerDia.categoriasPrioritarias,
      });
    });
  }

  return (
    <>
      {!esUnDia && (
        <div className="preferences-days">
          <div className="preferences-days__header">
            <div className="planificacion-form-header">
              <h2>¿Cómo viajás y qué te interesa cada día?</h2>
              <p className="planificacion-form-description text-muted">
                Elegí la modalidad de viaje y las categorías de interés para
                cada día.
              </p>
            </div>
            <button
              type="button"
              className="preferences-days__shortcut"
              onClick={aplicarMismasPreferencias}
              disabled={!puedeCopiarPreferencias}
            >
              Usar las mismas preferencias para todos los días
            </button>
          </div>

          <DaySelectorTabs
            dias={dias}
            diaActivo={diaSeleccionado}
            onChange={setDiaActivo}
            isComplete={preferenciasDiaCompletas}
          />
        </div>
      )}

      {errors.dias && (
        <div className="planificacion-field-error" role="alert">
          <p>{errors.dias}</p>
        </div>
      )}

      <PreferenceFields
        dia={dia}
        categorias={categorias}
        onChange={(changes) => {
          if (dia) {
            onChangeDia(dia.dia, changes);
          }
        }}
        errorModalidad={esUnDia ? errors.modalidadViaje : undefined}
        errorCategorias={esUnDia ? errors.categoriasPrioritarias : undefined}
      />
    </>
  );
}

export default TravelCompanionsAndInterestsStep;
