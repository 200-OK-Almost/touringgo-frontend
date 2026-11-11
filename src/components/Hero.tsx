import HeroBadge from "./HeroBadge";
import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__inner">
        <HeroBadge />
        <h1 className="hero__title">Tu salida por Buenos Aires, armada en un toque.</h1>
        <button 
          type="button" 
          className="hero__cta"
          onClick={() => navigation.navigate("/planificacion")}
        >
          Planificar nueva salida
        </button>
      </div>
    </section>
  );
}
