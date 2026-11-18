import { useState } from "react";
import type { ViajeDto } from "../../../types";
import { IoPaperPlane } from "react-icons/io5";
import "./ChatTab.css";

interface ChatTabProps {
  viaje: ViajeDto;
}

export function ChatTab({ viaje }: ChatTabProps) {
  const [inputText, setInputText] = useState("");

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    // Lógica para enviar mensaje al asistente en el futuro
    setInputText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-tab">
      <div className="chat-tab__header">
        <h2>{viaje.titulo || "Asistente Turi"}</h2>
      </div>

      <div className="chat-tab__body">
        <div className="chat-message user-message">
          <div className="chat-message__body">
            <p>
              ¡Hola Turi! ¿Qué lugares recomendás para comer cerca de la primera parada?
            </p>
          </div>
        </div>

        <div className="chat-message ai-message">
          <div className="chat-message__body">
            <p>
              ¡Hola! Para ese horario te sugiero probar los bodegones clásicos de la zona o parar en un café de especialidad.
            </p>
            <p>
              Cualquier cambio que quieras hacer en el itinerario, podés pedirme que agregue o reemplace paradas.
            </p>
          </div>
        </div>
      </div>

      <div className="chat-tab__input-box">
        <textarea
          className="chat-tab__input"
          placeholder="Escribe una consulta a tu asistente de viaje..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="chat-tab__input-bottom">
          <button
            type="button"
            className="chat-tab__send-btn"
            onClick={handleSendMessage}
            aria-label="Enviar mensaje"
          >
            <IoPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatTab;
