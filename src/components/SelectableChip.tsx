import React from "react";
import { IoCheckmarkSharp, IoAddSharp } from "react-icons/io5";
import "./SelectableChip.css"

export interface SelectableChipProps {
  label: string;
  icon?: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}

export function SelectableChip({ label, icon, selected, onClick }: SelectableChipProps) {
  return (
    <button
      type="button"
      className={`selectable-chip-btn ${selected ? "selectable-chip-btn--selected" : ""}`}
      onClick={onClick}
    >
      {icon && <span className="selectable-chip-btn__icon">{icon}</span>}
      <span className="selectable-chip-btn__label">{label}</span>
      <span className="selectable-chip-btn__check">
        {selected ? <IoCheckmarkSharp size={18} /> : <IoAddSharp size={18} />}
      </span>
    </button>
  );
}