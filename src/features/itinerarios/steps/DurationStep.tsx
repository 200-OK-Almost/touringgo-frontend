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
  const disponiblidadDiariaOptions: DayAvailabilityOption[] = [
    {
      title: "Dia completo", value: "DiaCompleto", description: "Mañana y tarde",
      icon: <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" data-d-component="icon"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 1C12.5523 1 13 1.44772 13 2V4C13 4.55228 12.5523 5 12 5C11.4477 5 11 4.55228 11 4V2C11 1.44772 11.4477 1 12 1ZM4.22183 4.22183C4.61235 3.8313 5.24551 3.8313 5.63604 4.22183L7.05025 5.63604C7.44078 6.02656 7.44078 6.65973 7.05025 7.05025C6.65973 7.44078 6.02656 7.44078 5.63604 7.05025L4.22183 5.63604C3.8313 5.24551 3.8313 4.61235 4.22183 4.22183ZM19.7782 4.22183C20.1687 4.61235 20.1687 5.24551 19.7782 5.63604L18.364 7.05025C17.9734 7.44078 17.3403 7.44078 16.9497 7.05025C16.5592 6.65973 16.5592 6.02656 16.9497 5.63604L18.364 4.22183C18.7545 3.8313 19.3876 3.8313 19.7782 4.22183ZM12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9ZM7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12ZM1 12C1 11.4477 1.44772 11 2 11H4C4.55228 11 5 11.4477 5 12C5 12.5523 4.55228 13 4 13H2C1.44772 13 1 12.5523 1 12ZM19 12C19 11.4477 19.4477 11 20 11H22C22.5523 11 23 11.4477 23 12C23 12.5523 22.5523 13 22 13H20C19.4477 13 19 12.5523 19 12ZM7.05025 16.9497C7.44078 17.3403 7.44078 17.9734 7.05025 18.364L5.63604 19.7782C5.24551 20.1687 4.61235 20.1687 4.22183 19.7782C3.8313 19.3876 3.8313 18.7545 4.22183 18.364L5.63604 16.9497C6.02656 16.5592 6.65973 16.5592 7.05025 16.9497ZM16.9497 16.9497C17.3403 16.5592 17.9734 16.5592 18.364 16.9497L19.7782 18.364C20.1687 18.7545 20.1687 19.3876 19.7782 19.7782C19.3877 20.1687 18.7545 20.1687 18.364 19.7782L16.9497 18.364C16.5592 17.9734 16.5592 17.3403 16.9497 16.9497ZM12 19C12.5523 19 13 19.4477 13 20V22C13 22.5523 12.5523 23 12 23C11.4477 23 11 22.5523 11 22V20C11 19.4477 11.4477 19 12 19Z" fill="currentColor"></path></svg>
    },
    {
      title: "Mañana", value: "MananaAlmuerzo", description: "Hasta el mediodía",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-d-component="icon"><path d="M12 2v8"></path><path d="m4.93 10.93 1.41 1.41"></path><path d="M2 18h2"></path><path d="M20 18h2"></path><path d="m19.07 10.93-1.41 1.41"></path><path d="M22 22H2"></path><path d="m8 6 4-4 4 4"></path><path d="M16 18a4 4 0 0 0-8 0"></path></svg>
    },
    {
      title: "Tarde", value: "TardeNoche", description: "Desde el mediodía hasta la noche",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-d-component="icon"><path d="M12 10V2"></path><path d="m4.93 10.93 1.41 1.41"></path><path d="M2 18h2"></path><path d="M20 18h2"></path><path d="m19.07 10.93-1.41 1.41"></path><path d="M22 22H2"></path><path d="m16 6-4 4-4-4"></path><path d="M16 18a4 4 0 0 0-8 0"></path></svg>
    },
  ];

  return (
    <>
      <div className="planificacion-form-header">
        <h2>Fechas del viaje</h2>
        <p className="planificacion-form-description text-muted">
          Elegí la fecha de inicio y de fin. El viaje puede durar entre 1 y 7 días.
        </p>
      </div>

      <RangoFechasSelector
        fechaInicio={fechaInicio}
        fechaFin={fechaFin}
        onChange={(changes) => onChange(changes)}
        error={errors.fechaInicio ?? errors.fechaFin}
      />

      <div className="planificacion-form-header duration-step__availability-header">
        <h2 id="duration-availability-title" tabIndex={-1}>¿Cuanto tiempo querés dedicar a recorrer cada día?</h2>
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
        {disponiblidadDiariaOptions.map((d) => (
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
