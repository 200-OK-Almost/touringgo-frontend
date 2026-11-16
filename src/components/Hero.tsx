import HeroBadge from "./HeroBadge";
import "./Hero.css";
import { Link } from "react-router-dom";
import heroVideo from "../assets/VideoHero/gemini_generated_video_ca30ad99.mp4";

export default function Hero() {
  return (
    <section className="hero">
      <video
        className="hero__video"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        <source src={heroVideo} type="video/mp4" />
      </video>
      <div className="hero__overlay" aria-hidden="true" />
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
