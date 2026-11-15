import HeroBadge from "./HeroBadge";
import "./Hero.css";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__inner">
        <HeroBadge />
        <h1 className="hero__title">Tu salida por Buenos Aires, armada en un toque.</h1>
        <Link 
          // type="button" 
          to="/planificacion"
          className="hero__cta"

          // onClick={() => navigation.navigate("/planificacion")}
        >
          Planificar nueva salida
        </Link>
      </div>
    </section>
  );
}
