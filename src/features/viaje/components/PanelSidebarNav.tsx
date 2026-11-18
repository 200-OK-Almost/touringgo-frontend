import { IoChatbubblesOutline, IoPeopleOutline, IoSettingsOutline } from "react-icons/io5"
import "./ViajeMap.css"

function PanelSidebarNav() {
  return (
    <div className="viaje-chat-left-column">
      <div className="viaje-chat-left-column-top">
        <button 
          className="viaje-chat-left-column-btn"
        >
          <IoChatbubblesOutline className="viaje-chat-left-column-icon"/>
        </button>
        <button 
          className="viaje-chat-left-column-btn"
        >
          <IoPeopleOutline className="viaje-chat-left-column-icon"/>
        </button>

      </div>
      <div className="viaje-chat-left-column-bottom">
        <button 
          className="viaje-chat-left-column-btn"
        >
          <IoSettingsOutline className="viaje-chat-left-column-icon"/>
        </button>
      </div>
    </div>
  )
}
export default PanelSidebarNav