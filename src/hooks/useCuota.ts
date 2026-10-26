import { useEffect, useState } from "react";
import { getCuota } from "../api/lugares";
import type { ControlCuotaGoogleDto } from "../api/types";

export type CuotaState =
  | { status: "loading"; data: null }
  | { status: "ok"; data: ControlCuotaGoogleDto }
  | { status: "error"; data: null };

export function useCuota(): CuotaState {
  const [state, setState] = useState<CuotaState>({ status: "loading", data: null });

  useEffect(() => {
    let active = true;

    getCuota()
      .then((data) => {
        if (active) setState({ status: "ok", data });
      })
      .catch(() => {
        if (active) setState({ status: "error", data: null });
      });

    return () => {
      active = false;
    };
  }, []);

  return state;
}
