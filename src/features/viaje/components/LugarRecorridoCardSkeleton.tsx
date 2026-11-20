export function LugarRecorridoCardSkeleton() {
  return (
    <div className="lugar-recorrido-card">
      <div className="lugar-recorrido-card__body">
        <div className="lugar-recorrido-card__thumb skeleton" />
        <div className="lugar-recorrido-card__info" style={{ gap: "0.5rem" }}>
          <div className="skeleton" style={{ height: "16px", width: "65%", borderRadius: "4px" }} />
          <div className="skeleton" style={{ height: "14px", width: "40%", borderRadius: "999px" }} />
          <div className="skeleton" style={{ height: "13px", width: "45%", borderRadius: "4px" }} />
          <div className="skeleton" style={{ height: "13px", width: "30%", borderRadius: "4px" }} />
        </div>
      </div>
    </div>
  );
}