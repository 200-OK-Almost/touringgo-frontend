import "./PlaceCardSkeleton.css";

export default function PlaceCardSkeleton() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton skeleton-card__media" />
      <div className="skeleton-card__body">
        <div className="skeleton skeleton-card__line skeleton-card__line--short" />
        <div className="skeleton skeleton-card__line" />
        <div className="skeleton skeleton-card__line skeleton-card__line--mid" />
        <div className="skeleton-card__chips">
          <div className="skeleton skeleton-card__chip" />
          <div className="skeleton skeleton-card__chip" />
        </div>
      </div>
    </div>
  );
}
