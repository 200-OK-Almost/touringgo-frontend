import HeroBadge from "./HeroBadge";
import "./Hero.css";
import { Link } from "react-router-dom";
import heroVideo from "../assets/VideoHero/gemini_generated_video_ca30ad99.mp4";
import { useAuth } from "../features/auth/auth-context";
import { useState } from "react";
import LoginModal from "./LoginModal";

export default function Hero() {
  const { user, isAuthenticated } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleScrollToCatalogo = () => {
    const el = document.getElementById("catalogo-explorador");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
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
        <p className="hero__subtitle">
          Planificá itinerarios inteligentes a medida o explorá más de 1.600 lugares reales por toda la ciudad.
        </p>
        <div className="hero__actions">
          {isAuthenticated && user ?  (
          <Link to="/planificacion" className="hero__cta">
            Planificar nueva salida
          </Link>
          ) : (
          <button 
            className="hero__cta"
            onClick={() => setIsLoginModalOpen(true)}
          >
            Planificar nueva salida
          </button>
          )
          }
          <button
            type="button"
            onClick={handleScrollToCatalogo}
            className="hero__secondary-cta"
          >
            Explorar catálogo ↓
          </button>
        </div>
      </div>
    </section>
    <LoginModal 
      isOpen={isLoginModalOpen} 
      onClose={() => setIsLoginModalOpen(false)} 
    />
    </>
  );
}
