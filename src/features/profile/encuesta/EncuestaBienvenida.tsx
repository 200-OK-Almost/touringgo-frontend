import { IoCompassOutline } from "react-icons/io5";

interface EncuestaBienvenidaProps {
  onStart: () => void;
}

export default function EncuestaBienvenida({
  onStart
}: EncuestaBienvenidaProps) {
  return (
    <section className="encuesta-bienvenida">
      <div className="encuesta-bienvenida__card">
        <div className="encuesta-bienvenida__icon-badge" aria-hidden="true">
          <IoCompassOutline />
        </div>

        <h1 className="encuesta-bienvenida__title">¡Bienvenido a TouringGo!</h1>

        <div className="encuesta-bienvenida__description">
          <p>
            Antes de comenzar, queremos conocer un poco más sobre tus
            intereses y necesidades para ayudarte a planificar mejores viajes.
          </p>

          <p className="encuesta-bienvenida__hint">
            Solo te llevará un par de minutos y podrás modificar tus
            preferencias cuando quieras desde tu perfil.
          </p>
        </div>

        <button
          type="button"
          onClick={onStart}
          className="encuesta-bienvenida__btn"
        >
          Comenzar
        </button>
      </div>
    </section>
  );
}
