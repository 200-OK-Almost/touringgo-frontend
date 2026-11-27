import { useState } from "react";
import {
  IoBeerOutline,
  IoCafeOutline,
  IoColorPaletteOutline,
  IoFlashOutline,
  IoLeafOutline,
  IoLibraryOutline,
  IoPeople,
  IoPeopleOutline,
  IoPersonOutline,
  IoPizzaOutline,
  IoWineOutline,
} from "react-icons/io5";
import { BsGem, BsPiggyBank, BsWallet2 } from "react-icons/bs";
import { SelectableCard } from "../../../components/SelectableCard";
import { SelectableCardGroup } from "../../../components/SelectableCardGroup";
import type { CategoriaDto } from "../../../api/types";
import type { FormErrors } from "../PlanificationForm.validation";
import type { DiaPlanificacion } from "../planificacionFormData";
import type { ModalidadViaje, RitmoCaminata } from "../types";
import type { NivelPresupuesto } from "../../viaje/types";
import DaySelectorTabs from "../components/DaySelectorTabs";
import { preferenciasDiaCompletas } from "../lib/diasPlanificacion";

interface InteresesYEstiloStepProps {
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

type RitmoVisitaOption = {
  title: string;
  description: string;
  icon: React.ReactNode;
  value: RitmoCaminata;
};

type PresupuestoOption = {
  title: string;
  description: string;
  value: NivelPresupuesto;
  icon: React.ReactNode;
};

interface PreferenciasDiaProps {
  dia: DiaPlanificacion | null;
  categorias: CategoriaDto[];
  onChange: (changes: Partial<DiaPlanificacion>) => void;
  errorModalidad?: string;
  errorCategorias?: string;
  errorRitmo?: string;
  errorPresupuesto?: string;
}

const MAX_CATEGORIAS = 4;

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

const RITMO_OPTIONS: RitmoVisitaOption[] = [
  {
    value: "Tranquilo",
    title: "Relajado",
    description: "Pausado y contemplativo, con pocas paradas y más tiempo libre.",
    icon: <IoCafeOutline />,
  },
  {
    value: "Activo",
    title: "Activo",
    description: "Días intensos aprovechando al máximo cada atracción.",
    icon: <IoFlashOutline />,
  },
];

const PRESUPUESTO_OPTIONS: PresupuestoOption[] = [
  {
    value: "Economico",
    title: "Económico",
    description: "Prioriza actividades gratuitas o de bajo costo",
    icon: <BsPiggyBank />,
  },
  {
    value: "Equilibrado",
    title: "Equilibrado",
    description: "Combina opciones gratuitas y de bajo costo con algunas experiencias pagas",
    icon: <BsWallet2 />,
  },
  {
    value: "SinRestricciones",
    title: "Flexible",
    description: "Considera una mayor variedad de actividades y experiencias",
    icon: <BsGem />,
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

function PreferenciasDia({
  dia,
  categorias,
  onChange,
  errorModalidad,
  errorCategorias,
  errorRitmo,
  errorPresupuesto,
}: PreferenciasDiaProps) {
  const modalidadViaje = dia?.modalidadViaje ?? null;
  const categoriasPrioritarias = dia?.categoriasPrioritarias ?? [];
  const ritmoVisita = dia?.ritmoVisita ?? null;
  const presupuestoNivel = dia?.presupuestoNivel ?? null;
  const limiteAlcanzado = categoriasPrioritarias.length >= MAX_CATEGORIAS;

  const categoriaOptions: CategoriaOption[] = categorias.map((categoria) => ({
    title: categoria.nombre,
    value: categoria,
    icon: ICON_MAP[categoria.codigo],
  }));

  return (
    <>
      <div className="planificacion-form-header">
        <h3 id="preferences-modalidad-title" tabIndex={-1}>Modalidad de viaje</h3>
      </div>
      <SelectableCardGroup
        role="radiogroup"
        labelledBy="preferences-modalidad-title"
        describedBy={
          errorModalidad ? "preferences-modalidad-error" : undefined
        }
        className="selectable-card-group grid-3"
      >
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
      </SelectableCardGroup>
      {errorModalidad && (
        <div
          id="preferences-modalidad-error"
          className="planificacion-field-error"
          role="alert"
        >
          <p>{errorModalidad}</p>
        </div>
      )}

      <div className="planificacion-form-header">
        <h3 id="preferences-categorias-title" tabIndex={-1}>Categorías de interés</h3>
        <div
          id="preferences-categorias-help"
          className="categories-help"
          aria-live="polite"
        >
          <p className="categories-help__text">
            {categoriasPrioritarias.length} de {MAX_CATEGORIAS}{" "}
            {categoriasPrioritarias.length === 1
              ? "seleccionada"
              : "seleccionadas"}
          </p>
          <span className="categories-help__hint">
            {limiteAlcanzado
              ? "Límite alcanzado"
              : categoriasPrioritarias.length < 2
                ? "Elegí al menos 2"
                : "Hasta 4 categorías"}
          </span>
          <span className="categories-meter" aria-hidden="true">
            {Array.from({ length: MAX_CATEGORIAS }, (_, index) => (
              <span
                key={index}
                className={`categories-meter__segment ${
                  index < categoriasPrioritarias.length
                    ? "categories-meter__segment--on"
                    : ""
                }`}
              />
            ))}
          </span>
        </div>
      </div>
      <SelectableCardGroup
        role="group"
        labelledBy="preferences-categorias-title"
        describedBy={
          errorCategorias
            ? "preferences-categorias-help preferences-categorias-error"
            : "preferences-categorias-help"
        }
        className="selectable-card-group grid-auto"
      >
        {categoriaOptions.map((categoria) => {
          const seleccionada = categoriasPrioritarias.some(
            (seleccionadaActual) =>
              seleccionadaActual.id === categoria.value.id
          );

          return (
            <SelectableCard
              key={categoria.value.id ?? categoria.title}
              title={categoria.title}
              icon={categoria.icon}
              selected={seleccionada}
              disabled={!seleccionada && limiteAlcanzado}
              variant="big"
              selectionIndicator="checkbox"
              onClick={() => {
                if (!seleccionada && limiteAlcanzado) {
                  return;
                }

                const nuevasCategorias = seleccionada
                  ? categoriasPrioritarias.filter(
                      (seleccionadaActual) =>
                        seleccionadaActual.id !== categoria.value.id
                    )
                  : [...categoriasPrioritarias, categoria.value];

                onChange({ categoriasPrioritarias: nuevasCategorias });
              }}
            />
          );
        })}
      </SelectableCardGroup>
      {errorCategorias && (
        <div
          id="preferences-categorias-error"
          className="planificacion-field-error"
          role="alert"
        >
          <p>{errorCategorias}</p>
        </div>
      )}

      <div className="intereses-estilo__estilo">
        <div className="planificacion-form-header">
          <h3 id="intereses-estilo-title">Estilo del día</h3>
        </div>
        <div className="intereses-estilo__grid">
          <div className="intereses-estilo__grupo">
            <h4 id="style-ritmo-title" tabIndex={-1} className="intereses-estilo__grupo-title">
              Ritmo
            </h4>
            <SelectableCardGroup
              role="radiogroup"
              labelledBy="style-ritmo-title"
              describedBy={errorRitmo ? "style-ritmo-error" : undefined}
              className="selectable-card-group grid-2"
            >
              {RITMO_OPTIONS.map((ritmo) => (
                <SelectableCard
                  key={ritmo.value}
                  title={ritmo.title}
                  selected={ritmoVisita === ritmo.value}
                  icon={ritmo.icon}
                  description={ritmo.description}
                  onClick={() => onChange({ ritmoVisita: ritmo.value })}
                  variant="big"
                />
              ))}
            </SelectableCardGroup>
            {errorRitmo && (
              <div id="style-ritmo-error" className="planificacion-field-error" role="alert">
                <p>{errorRitmo}</p>
              </div>
            )}
          </div>

          <div className="intereses-estilo__grupo">
            <h4 id="style-presupuesto-title" tabIndex={-1} className="intereses-estilo__grupo-title">
              Presupuesto
            </h4>
            <SelectableCardGroup
              role="radiogroup"
              labelledBy="style-presupuesto-title"
              describedBy={
                errorPresupuesto ? "style-presupuesto-error" : undefined
              }
              className="selectable-card-group grid-3"
            >
              {PRESUPUESTO_OPTIONS.map((presupuesto) => (
                <SelectableCard
                  key={presupuesto.value}
                  title={presupuesto.title}
                  icon={presupuesto.icon}
                  description={presupuesto.description}
                  selected={presupuestoNivel == presupuesto.value}
                  onClick={() => onChange({ presupuestoNivel: presupuesto.value })}
                  variant="big"
                />
              ))}
            </SelectableCardGroup>
            {errorPresupuesto && (
              <div id="style-presupuesto-error" className="planificacion-field-error" role="alert">
                <p>{errorPresupuesto}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function InteresesYEstiloStep({
  dias,
  categorias,
  onChangeDia,
  errors,
}: InteresesYEstiloStepProps) {
  const [diaActivo, setDiaActivo] = useState(1);
  const esUnDia = dias.length <= 1;
  const diaSeleccionado = dias.some((dia) => dia.dia === diaActivo)
    ? diaActivo
    : dias[0]?.dia ?? 1;
  const dia = dias.find((item) => item.dia === diaSeleccionado) ?? null;
  const primerDia = dias[0];
  const puedeCopiarPreferencias = Boolean(
    primerDia?.modalidadViaje ||
      primerDia?.ritmoVisita ||
      primerDia?.presupuestoNivel ||
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
        ritmoVisita: primerDia.ritmoVisita,
        presupuestoNivel: primerDia.presupuestoNivel,
      });
    });
  }

  return (
    <div className="intereses-estilo">
      {!esUnDia && (
        <div className="preferences-days">
          <div className="preferences-days__header">
            <div className="planificacion-form-header">
              <h3>¿Cómo viajás y qué te interesa cada día?</h3>
              <p className="planificacion-form-description text-muted">
                Elegí la modalidad, las categorías, el ritmo y el presupuesto
                para cada día.
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
            idPrefix="preferences-day"
            panelId="preferences-day-panel"
          />
        </div>
      )}

      {errors.dias && (
        <div
          id="planificacion-dias-error"
          className="planificacion-field-error"
          role="alert"
          tabIndex={-1}
        >
          <p>{errors.dias}</p>
        </div>
      )}

      <div
        id="preferences-day-panel"
        role={esUnDia ? undefined : "tabpanel"}
        aria-labelledby={
          esUnDia ? undefined : `preferences-day-${diaSeleccionado}`
        }
        className="intereses-estilo__dia"
      >
        <PreferenciasDia
          dia={dia}
          categorias={categorias}
          onChange={(changes) => {
            if (dia) {
              onChangeDia(dia.dia, changes);
            }
          }}
          errorModalidad={esUnDia ? errors.modalidadViaje : undefined}
          errorCategorias={
            esUnDia ? errors.categoriasPrioritarias : undefined
          }
          errorRitmo={esUnDia ? errors.ritmoVisita : undefined}
          errorPresupuesto={esUnDia ? errors.presupuestoNivel : undefined}
        />
      </div>
    </div>
  );
}

export default InteresesYEstiloStep;
