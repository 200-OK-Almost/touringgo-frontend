import React from "react";
import "./SelectableCard.css"

export interface SelectableCardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}

export function SelectableCard({ title, description, icon, selected, onClick }: SelectableCardProps) {
  return (
    <button
      type="button"
      className={`selectable-card-option ${selected ? "selectable-card-option--selected" : ""}`}
      onClick={onClick}
    >
      {icon && <span className="selectable-card-option__icon">{icon}</span>}
      <div className="selectable-card-option__content">
        <span className="selectable-card-option__title">{title}</span>
        {description && <span className="selectable-card-option__desc">{description}</span>}
      </div>
      <span className="selectable-card-option__radio">
        {selected && <span className="selectable-card-option__radio-dot" />}
      </span>
    </button>
  );
}