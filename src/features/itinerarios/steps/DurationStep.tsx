import { IoMoonOutline, IoPartlySunnyOutline, IoSunnyOutline } from "react-icons/io5";
import { SelectableCard } from "../../../components/SelectableCard";
import { SelectableCardGroup } from "../../../components/SelectableCardGroup";
import { RangoFechasSelector } from "../components/RangoFechasSelector";
import type { FormErrors } from "../PlanificationForm.validation";
import type { DisponibilidadDiaria } from "../types";

type DayAvailabilityOption = {
  title: string;
  description: string;
  icon: React.ReactNode;
  value: DisponibilidadDiaria;
};

interface DurationStepProps {
  fechaInicio: string | null;
  fechaFin: string | null;
  disponibilidadDiaria: DisponibilidadDiaria | null;
  onChange: (changes: {
    fechaInicio?: string | null;
    fechaFin?: string | null;
    disponibilidadDiaria?: DisponibilidadDiaria;
  }) => void;
  errors: FormErrors;
}

function DurationStep({
  fechaInicio,
  fechaFin,
  disponibilidadDiaria,
  onChange,
  errors,
}: DurationStepProps) {
  const disponibilidadDiariaOptions: DayAvailabilityOption[] = [
    {
      title: "Día completo",
      value: "DiaCompleto",
      description: "Mañana y tarde",
      icon: <IoSunnyOutline />,
    },
    {
      title: "Mañana",
      value: "MananaAlmuerzo",
      description: "Hasta el mediodía",
      icon: <IoPartlySunnyOutline />,
    },
    {
      title: "Tarde",
      value: "TardeNoche",
      description: "Desde el mediodía hasta la noche",
      icon: <IoMoonOutline />,
    },
  ];

  return (
    <>
      <div className="planificacion-form-header">
        <h3>Fechas del viaje</h3>
        <p className="planificacion-form-description text-muted">
          Elegí la fecha de inicio y la duración del viaje. Puede durar entre 1 y 7 días.
        </p>
      </div>

      <RangoFechasSelector
        fechaInicio={fechaInicio}
        fechaFin={fechaFin}
        onChange={(changes) => onChange(changes)}
        error={errors.fechaInicio ?? errors.fechaFin}
      />

      <div className="planificacion-form-header duration-step__availability-header">
        <h3 id="duration-availability-title" tabIndex={-1}>¿Cuánto tiempo querés dedicar a recorrer cada día?</h3>
      </div>
      <SelectableCardGroup
        role="radiogroup"
        labelledBy="duration-availability-title"
        describedBy={
          errors.disponibilidadDiaria
            ? "duration-availability-error"
            : undefined
        }
        className="selectable-card-group grid-3"
      >
        {disponibilidadDiariaOptions.map((d) => (
          <SelectableCard
            key={d.value}
            title={d.title}
            icon={d.icon}
            description={d.description}
            selected={disponibilidadDiaria === d.value}
            onClick={() => onChange({ disponibilidadDiaria: d.value })}
            variant="big"
          />
        ))}
      </SelectableCardGroup>
      {errors.disponibilidadDiaria && (
        <div
          id="duration-availability-error"
          className="planificacion-field-error"
          role="alert"
        >
          <p>{errors.disponibilidadDiaria}</p>
        </div>
      )}
    </>
  );
}

export default DurationStep;
