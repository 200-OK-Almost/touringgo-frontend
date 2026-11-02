import "./StatusBar.css"
import { IoCheckmarkSharp } from "react-icons/io5";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

interface StatusBarProps {
  status: SaveStatus;
  feedbackMessage?: string | null;
}

export function StatusBar({ status, feedbackMessage }: StatusBarProps) {
  if (status === "idle" && !feedbackMessage) return null;

  return (
    <div className="status-bar" aria-live="polite">
      {status === "saving" && (
        <span className="status status--saving">
          <span className="status__spinner" /> Guardando...
        </span>
      )}
      {status === "saved" && (
        <span className="status status--saved">
          <IoCheckmarkSharp />
          <p>Cambios guardados</p>
        </span>
      )}
      {status === "error" && (
        <span className="status status--error">
          <p>Error al guardar los cambios</p>
        </span>
      )}
      {feedbackMessage && status !== "error" && (
        <span className="status status--info">
          ℹ {feedbackMessage}
        </span>
      )}
    </div>
  );
}