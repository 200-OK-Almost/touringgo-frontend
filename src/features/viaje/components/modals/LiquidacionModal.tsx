import { useEffect, useState } from "react";
import { Modal } from "../../../../components/Modal";
import type {
  LiquidacionDto,
  MiembroViajeDto,
  PrevisualizacionLiquidacionDto,
} from "../../types";
import { getLiquidacionPreview, postLiquidacion } from "../../api/viajes";
import {
  IoArrowForward,
  IoCheckmarkDoneCircleOutline,
  IoInformationCircleOutline,
  IoWalletOutline,
} from "react-icons/io5";
import "./LiquidacionModal.css";

export interface LiquidacionModalProps {
  isOpen: boolean;
  onClose: () => void;
  viajeId: string;
  gastoIds: string[];
  miembrosPorId?: Map<string, MiembroViajeDto>;
  onLiquidacionExitosa?: (liquidacion: LiquidacionDto) => void;
}

export function LiquidacionModal({
  isOpen,
  onClose,
  viajeId,
  gastoIds,
  miembrosPorId,
  onLiquidacionExitosa,
}: LiquidacionModalProps) {
  const [preview, setPreview] =
    useState<PrevisualizacionLiquidacionDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Al abrir el modal, cargamos la previsualización de transferencias
  useEffect(() => {
    if (!isOpen || gastoIds.length === 0) {
      setPreview(null);
      setError(null);
      return;
    }

    let isMounted = true;
    async function fetchPreview() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getLiquidacionPreview(viajeId, { gastoIds });
        if (isMounted) {
          setPreview(data);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const msg =
            err instanceof Error
              ? err.message
              : "No se pudo obtener la previsualización de la liquidación.";
          setError(msg);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchPreview();

    return () => {
      isMounted = false;
    };
  }, [isOpen, viajeId, gastoIds]);

  const handleConfirmarLiquidacion = async () => {
    if (gastoIds.length === 0) return;

    try {
      setIsSubmitting(true);
      setError(null);
      const liquidacion = await postLiquidacion(viajeId, { gastoIds });
      onLiquidacionExitosa?.(liquidacion);
      onClose();
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Ocurrió un error al confirmar la liquidación.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatMonto = (monto: number, moneda: string = "ARS") => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: moneda === "USD" ? "USD" : "ARS",
      maximumFractionDigits: 2,
    }).format(monto);
  };

  const getNombreMiembro = (usuarioId: string) => {
    const miembro = miembrosPorId?.get(usuarioId);
    return miembro?.nombre || "Miembro";
  };

  const getFotoMiembro = (usuarioId: string) => {
    return miembrosPorId?.get(usuarioId)?.fotoUrl;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Liquidar cuentas del viaje"
      size="md"
      className="liquidacion-modal"
    >
      <div className="liquidacion-container">
        {/* Banner explicativo con redacción clara y profesional */}
        <div className="liquidacion-info-banner">
          <IoInformationCircleOutline className="liquidacion-info-banner__icon" />
          <div className="liquidacion-info-banner__content">
            <h4>¿Cómo funciona la liquidación?</h4>
            <p>
              El sistema calcula las transferencias mínimas necesarias para saldar
              todas las diferencias entre los participantes.
            </p>
            <p className="liquidacion-info-banner__highlight">
              Asegúrense de realizar los pagos o transferencias bancarias correspondientes.
              Una vez efectuadas, hagan clic en <strong>Confirmar liquidación</strong> para
              dar por saldados estos gastos y archivarlos en el historial del viaje.
            </p>
          </div>
        </div>

        {error && <div className="liquidacion-error-banner">{error}</div>}

        {/* Estado de carga */}
        {isLoading && (
          <div className="liquidacion-loading">
            <div className="liquidacion-loading__spinner" />
            <p>Calculando el balance y las transferencias óptimas...</p>
          </div>
        )}

        {/* Lista de transferencias calculadas */}
        {!isLoading && preview && (
          <div className="liquidacion-section">
            <div className="liquidacion-section__header">
              <span className="liquidacion-section__title">
                Transferencias a realizar ({preview.transferencias.length})
              </span>
              <span className="liquidacion-section__count">
                {gastoIds.length} {gastoIds.length === 1 ? "gasto seleccionado" : "gastos seleccionados"}
              </span>
            </div>

            {preview.transferencias.length === 0 ? (
              <div className="liquidacion-empty">
                <IoCheckmarkDoneCircleOutline className="liquidacion-empty__icon" />
                <p className="liquidacion-empty__title">
                  ¡No se requieren transferencias!
                </p>
                <p className="liquidacion-empty__desc">
                  Los gastos seleccionados ya se encuentran compensados equitativamente entre los participantes.
                </p>
              </div>
            ) : (
              <div className="liquidacion-transferencias-list">
                {preview.transferencias.map((t, idx) => {
                  const nombreDe = getNombreMiembro(t.deParticipanteId);
                  const nombreA = getNombreMiembro(t.aParticipanteId);
                  const fotoDe = getFotoMiembro(t.deParticipanteId);
                  const fotoA = getFotoMiembro(t.aParticipanteId);

                  return (
                    <div key={idx} className="liquidacion-card">
                      {/* Miembro que debe pagar */}
                      <div className="liquidacion-card__party liquidacion-card__party--de">
                        {fotoDe ? (
                          <img
                            src={fotoDe}
                            alt={nombreDe}
                            className="liquidacion-card__avatar"
                          />
                        ) : (
                          <span className="liquidacion-card__avatar-placeholder">
                            {nombreDe.charAt(0).toUpperCase()}
                          </span>
                        )}
                        <div className="liquidacion-card__party-info">
                          <span className="liquidacion-card__party-label">Debe transferir</span>
                          <span className="liquidacion-card__party-name" title={nombreDe}>
                            {nombreDe}
                          </span>
                        </div>
                      </div>

                      {/* Flecha e indicador de monto */}
                      <div className="liquidacion-card__transfer-flow">
                        <div className="liquidacion-card__monto-tag">
                          <IoWalletOutline className="liquidacion-card__monto-icon" />
                          <span>{formatMonto(t.monto, preview.moneda)}</span>
                        </div>
                        <div className="liquidacion-card__arrow-track">
                          <span className="liquidacion-card__arrow-line" />
                          <IoArrowForward className="liquidacion-card__arrow-icon" />
                        </div>
                      </div>

                      {/* Miembro que recibe */}
                      <div className="liquidacion-card__party liquidacion-card__party--a">
                        {fotoA ? (
                          <img
                            src={fotoA}
                            alt={nombreA}
                            className="liquidacion-card__avatar"
                          />
                        ) : (
                          <span className="liquidacion-card__avatar-placeholder liquidacion-card__avatar-placeholder--recipient">
                            {nombreA.charAt(0).toUpperCase()}
                          </span>
                        )}
                        <div className="liquidacion-card__party-info">
                          <span className="liquidacion-card__party-label">Recibe</span>
                          <span className="liquidacion-card__party-name" title={nombreA}>
                            {nombreA}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Botones de acción */}
        <div className="liquidacion-actions">
          <button
            type="button"
            className="liquidacion-btn liquidacion-btn--cancel"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="liquidacion-btn liquidacion-btn--confirm"
            onClick={handleConfirmarLiquidacion}
            disabled={isLoading || isSubmitting || !preview}
          >
            {isSubmitting ? "Confirmando liquidación..." : "Confirmar liquidación"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default LiquidacionModal;
