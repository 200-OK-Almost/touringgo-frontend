import "./CollapsibleSection.css";

export interface CollapsibleSectionProps {
  titleId: string;
  title: string;
  summary?: string;
  complete?: boolean;
  children: React.ReactNode;
}

export function CollapsibleSection({
  titleId,
  title,
  summary,
  complete = false,
  children,
}: CollapsibleSectionProps) {
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

        {complete && (
          <div className="collapsible-section__actions">
            <span className="collapsible-section__badge">Completado</span>
          </div>
        )}
      </div>

      <div className="collapsible-section__content">{children}</div>
    </section>
  );
}

export default CollapsibleSection;
