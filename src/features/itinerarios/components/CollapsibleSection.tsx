import { useId, useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import "./CollapsibleSection.css";

export interface CollapsibleSectionProps {
  titleId: string;
  title: string;
  summary?: string;
  complete?: boolean;
  forceOpen?: boolean;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function CollapsibleSection({
  titleId,
  title,
  summary,
  complete = false,
  forceOpen = false,
  defaultOpen = true,
  children,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = useId();
  const isOpen = open || forceOpen;

  return (
    <section className="collapsible-section">
      <div className="collapsible-section__header">
        <div className="collapsible-section__info">
          <h3
            id={titleId}
            className="collapsible-section__title"
            tabIndex={-1}
          >
            {title}
          </h3>
          {summary && (
            <p className="collapsible-section__summary">{summary}</p>
          )}
        </div>

        <div className="collapsible-section__actions">
          {complete && (
            <span className="collapsible-section__badge">Completado</span>
          )}
          {!forceOpen && (
            <button
              type="button"
              className="collapsible-section__toggle"
              aria-expanded={isOpen}
              aria-controls={contentId}
              onClick={() => setOpen((prev) => !prev)}
            >
              {isOpen ? "Ocultar" : "Editar"}
              <IoChevronDown
                className={`collapsible-section__chevron ${
                  isOpen ? "collapsible-section__chevron--open" : ""
                }`}
                aria-hidden="true"
              />
            </button>
          )}
        </div>
      </div>

      <div
        id={contentId}
        className="collapsible-section__content"
        hidden={!isOpen}
      >
        {children}
      </div>
    </section>
  );
}

export default CollapsibleSection;
