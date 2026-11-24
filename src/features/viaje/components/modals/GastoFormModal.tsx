import { useState, useEffect, type FormEvent } from "react";
import { Modal } from "../../../../components/Modal";
import type { MiembroViajeDto, TipoMoneda, CrearGastoRequestDto, GastoDto, ActualizarGastoRequestDto } from "../../types";
import { editarGasto, postGasto } from "../../api/viajes";
import "./GastoFormModal.css";

interface GastoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  viajeId: string;
  miembros: MiembroViajeDto[];
  miembrosPorId?: Map<string, MiembroViajeDto>;
  mode: "crear" | "editar";
  gasto: GastoDto | null;
  onGastoGuardado?: () => void;
}


export function GastoFormModal({
  isOpen,
  onClose,
  viajeId,
  miembros,
  onGastoGuardado,
  mode,
  gasto = null
}: GastoFormModalProps) {
  const [concepto, setConcepto] = useState("");
  const [monto, setMonto] = useState("");
  const [moneda, setMoneda] = useState<TipoMoneda>("ARS");
  const [pagadoPorUsuarioId, setPagadoPorUsuarioId] = useState("");
  const [participantesIds, setParticipantesIds] = useState<string[]>([]);
  
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inicializar o resetear formulario al abrir o cuando cambian los miembros

  useEffect(() => {
    if (!isOpen) return 
    
    setConcepto(gasto?.concepto ?? "");
    setMonto(gasto ? String(gasto.monto) : "");
    setMoneda(gasto?.moneda ?? "ARS");
    setError(null);
    setIsSubmitting(false);

    if (gasto) {
      setPagadoPorUsuarioId(gasto.pagadoPorMiembroId);
      setParticipantesIds(gasto.divisiones.map(x => x.usuarioId));
    } else {
      // Por defecto todos los miembros participan de la división
      setPagadoPorUsuarioId(miembros[0]?.usuarioId ?? "");
      setParticipantesIds(miembros.map((m) => m.usuarioId));
    }
  }, [isOpen, gasto, miembros]);

  const handleToggleParticipante = (usuarioId: string) => {
    setParticipantesIds((prev) =>
      prev.includes(usuarioId)
        ? prev.filter((id) => id !== usuarioId)
        : [...prev, usuarioId]
    );
  };

  const handleSelectAllParticipantes = () => {
    if (participantesIds.length === miembros.length) {
      setParticipantesIds([]);
    } else {
      setParticipantesIds(miembros.map((m) => m.usuarioId));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const conceptoTrimmed = concepto.trim();
    if (!conceptoTrimmed) {
      setError("El concepto del gasto es requerido.");
      return;
    }

    const montoNum = parseFloat(monto);
    if (isNaN(montoNum) || montoNum <= 0) {
      setError("Ingrese un monto válido mayor a 0.");
      return;
    }

    if (!pagadoPorUsuarioId) {
      setError("Debe seleccionar quién pagó el gasto.");
      return;
    }

    if (participantesIds.length === 0) {
      setError("Debe seleccionar al menos un participante para dividir el gasto.");
      return;
    }

    const datos = {
      concepto: conceptoTrimmed,
      monto: montoNum,
      moneda,
      pagadoPorUsuarioId,
      ParticipantesIds: participantesIds,
    }
    
    
    try {
      setIsSubmitting(true);
      if (mode == "crear" && gasto == null) {
        const requestDto: CrearGastoRequestDto = {
          ... datos,
          fechaGasto: new Date().toISOString(),
        };
        await postGasto(viajeId, requestDto);
      } else if (mode == "editar" && gasto != null) {
        const actualizarRequestDto: ActualizarGastoRequestDto = {
          ... datos,
          fechaGasto: gasto.fechaGasto
        }
        await editarGasto(viajeId, gasto.id, actualizarRequestDto)
      }
      
      onGastoGuardado?.();
      onClose();
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Ocurrió un error al registrar el gasto. Intente nuevamente.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode == "editar" ? "Editar gasto" : "Cargar gasto"}      
      size="md"
      className="gasto-form-modal"
    >
      <form className="gasto-form" onSubmit={handleSubmit} noValidate>
        {error && <div className="gasto-form__alert-error">{error}</div>}

        <div className="gasto-form__field">
          <label htmlFor="gasto-concepto" className="gasto-form__label">
            Concepto
          </label>
          <input
            id="gasto-concepto"
            type="text"
            className="gasto-form__input"
            placeholder="Ej. Cena en bodegón, Combustible..."
            value={concepto}
            onChange={(e) => setConcepto(e.target.value)}
            disabled={isSubmitting}
            required
          />
        </div>

        <div className="gasto-form__row">
          <div className="gasto-form__field gasto-form__field--flex-2">
            <label htmlFor="gasto-monto" className="gasto-form__label">
              Monto
            </label>
            <input
              id="gasto-monto"
              type="number"
              step="any"
              min="0.01"
              className="gasto-form__input"
              placeholder="0.00"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="gasto-form__field gasto-form__field--flex-1">
            <label htmlFor="gasto-moneda" className="gasto-form__label">
              Moneda
            </label>
            <select
              id="gasto-moneda"
              className="gasto-form__select"
              value={moneda}
              onChange={(e) => setMoneda(e.target.value as TipoMoneda)}
              disabled={isSubmitting}
            >
              <option value="ARS">ARS ($)</option>
              <option value="USD">USD (US$)</option>
            </select>
          </div>
        </div>

        <div className="gasto-form__field">
          <label htmlFor="gasto-pagado-por" className="gasto-form__label">
            ¿Quién pagó?
          </label>
          <select
            id="gasto-pagado-por"
            className="gasto-form__select"
            value={pagadoPorUsuarioId}
            onChange={(e) => setPagadoPorUsuarioId(e.target.value)}
            disabled={isSubmitting}
            required
          >
            {miembros.length === 0 && (
              <option value="">No hay miembros disponibles</option>
            )}
            {miembros.map((miembro) => (
              <option key={miembro.usuarioId} value={miembro.usuarioId}>
                {miembro.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="gasto-form__field">
          <div className="gasto-form__participantes-header">
            <label className="gasto-form__label">
              ¿Entre quiénes se divide?
            </label>
            {miembros.length > 0 && (
              <button
                type="button"
                className="gasto-form__select-all-btn"
                onClick={handleSelectAllParticipantes}
                disabled={isSubmitting}
              >
                {participantesIds.length === miembros.length
                  ? "Deseleccionar todos"
                  : "Seleccionar todos"}
              </button>
            )}
          </div>

          <div className="gasto-form__multiselect-list">
            {miembros.length === 0 ? (
              <p className="gasto-form__empty-text">No hay miembros registrados.</p>
            ) : (
              miembros.map((miembro) => {
                const isSelected = participantesIds.includes(miembro.usuarioId);
                return (
                  <label
                    key={miembro.usuarioId}
                    className={`gasto-form__checkbox-card ${
                      isSelected ? "is-selected" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleParticipante(miembro.usuarioId)}
                      disabled={isSubmitting}
                    />
                    {miembro.fotoUrl ? (
                      <img
                        src={miembro.fotoUrl}
                        alt={miembro.nombre}
                        className="gasto-form__avatar"
                      />
                    ) : (
                      <span className="gasto-form__avatar-placeholder">
                        {miembro.nombre.charAt(0).toUpperCase()}
                      </span>
                    )}
                    <span className="gasto-form__member-name">{miembro.nombre}</span>
                  </label>
                );
              })
            )}
          </div>
          {participantesIds.length > 0 && monto && !isNaN(parseFloat(monto)) && (
            <p className="gasto-form__split-preview">
              División estimada:{" "}
              <strong>
                {moneda} ${(parseFloat(monto) / participantesIds.length).toFixed(2)}
              </strong>{" "}
              por persona ({participantesIds.length} participantes)
            </p>
          )}
        </div>

        <div className="gasto-form__actions">
          <button
            type="button"
            className="gasto-form__btn gasto-form__btn--cancel"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="gasto-form__btn gasto-form__btn--submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Guardando..."
              : mode == "editar"
                ? "Guardar cambios"
                : "Guardar gasto"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default GastoFormModal;
