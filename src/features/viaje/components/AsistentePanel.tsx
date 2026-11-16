import { IoPaperPlane, IoSparkles } from "react-icons/io5"
import "./AsistentePanel.css"

export const SidebarCollapseIcon = (props?: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <g transform="rotate(180 12 12)"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2"/><path d="M7.25 10L5.5 12l1.75 2m2.25 7V3"/></g></g>
  </svg>
);

export const SidebarExpandIcon = (props?: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <g transform="rotate(180 12 12)"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2m-9.5 0V3"/><path d="m5.5 10l1.75 2l-1.75 2"/></g></g>
  </svg>
);

function AsistentePanel() {
  return (
    <>
    <div className="asistente-header">
      <div className="asistente-header-left">
        <IoSparkles className="asistente-header-icon"/>
        <h3>Asistente</h3>
      </div>
      <div className="asistente-header-right">
        {SidebarCollapseIcon()}
      </div>
    </div>
    <div className="asistente-body">

    </div>
    <div className="asistente-footer">
      <div className="asistente-message-box">
        <input 
          className="asistente-input"
          type="text" 
          placeholder="Escribe una consulta a tu asistente de viaje"
          disabled
        />
        <button 
          className="asistente-send-button"
          disabled
        >
          <IoPaperPlane /> 
        </button>
      </div>
    </div>
    </>
  )
}
export default AsistentePanel