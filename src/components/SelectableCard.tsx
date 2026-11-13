import React from "react";
import "./SelectableCard.css"

export interface SelectableCardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  coloredIcon?: boolean;
  selected: boolean;
  onClick: () => void;
  selectionIndicator?: "radio" | "checkbox" | "none";
  variant?: "big" | "small";
}

export function SelectableCard({ 
  title, 
  description, 
  icon, 
  coloredIcon = true, 
  selected, 
  onClick, 
  selectionIndicator = "radio", 
  variant = "small" 
}: SelectableCardProps) {
  return (
    <button
      type="button"
      className={`selectable-card-option ${selected ? "selectable-card-option--selected" : ""} ${variant === "small" ? "selectable-card-small" : "selectable-card-big"}`}
      onClick={onClick}
    >
      {icon && 
        <span className={`selectable-card-option__icon ${coloredIcon ? "selectable-card-colored-icon" : ""}`}>
          {icon}
        </span>
      }
      
      <div className="selectable-card-option__content">
        <span className="selectable-card-option__title">{title}</span>
        {description && <span className="selectable-card-option__desc">{description}</span>}
      </div>
      
      {selectionIndicator === "radio" && (
        <span className="selectable-card-option__radio">
          {selected && <span className="selectable-card-option__radio-dot" />}
        </span>
      )}
      
      {selectionIndicator === "checkbox" && (
        <span className="selectable-card-option__checkbox">
          {selected && (
            <svg 
              className="selectable-card-option__check-icon" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="3" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          )}
        </span>
      )}
    </button>
  );
}