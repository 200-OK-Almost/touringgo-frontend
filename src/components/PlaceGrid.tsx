import type { LugarResumenDto } from "../api/types";
import EmptyState from "./EmptyState";
import ErrorState from "./ErrorState";
import PlaceCard from "./PlaceCard";
import PlaceCardSkeleton from "./PlaceCardSkeleton";
import "./PlaceGrid.css";

interface PlaceGridProps {
  lugares: LugarResumenDto[] | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onClearFilters: () => void;
  onSelect: (lugar: LugarResumenDto) => void;
}

export default function PlaceGrid({
  lugares,
  loading,
  error,
  onRetry,
  onClearFilters,
  onSelect,
}: PlaceGridProps) {
  if (loading) {
    return (
      <div className="place-grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <PlaceCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onReintentar={onRetry} />;
  }

  if (!lugares || lugares.length === 0) {
    return <EmptyState onLimpiar={onClearFilters} />;
  }

  return (
    <div className="place-grid">
      {lugares.map((lugar) => (
        <PlaceCard key={lugar.Id} lugar={lugar} onClick={() => onSelect(lugar)} />
      ))}
    </div>
  );
}
