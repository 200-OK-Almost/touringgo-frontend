import "./HeroBadge.css";

export default function HeroBadge() {
  return (
    <span className="hero-badge">
      <span className="hero-badge__dot" aria-hidden="true" />
      <span className="hero-badge__text">CABA a pie · 3 o 4 paradas por barrio</span>
    </span>
  );
}
