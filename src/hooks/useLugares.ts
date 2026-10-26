import { useEffect, useReducer } from "react";
import { getLugares } from "../api/lugares";
import type { LugarFiltro, LugarResumenDto } from "../api/types";

interface LugaresState {
  lugares: LugarResumenDto[] | null;
  total: number;
  loading: boolean;
  error: string | null;
}

type Action =
  | { type: "start" }
  | { type: "success"; lugares: LugarResumenDto[]; total: number }
  | { type: "error"; message: string };

const initialState: LugaresState = {
  lugares: null,
  total: 0,
  loading: true,
  error: null,
};

function reducer(_state: LugaresState, action: Action): LugaresState {
  switch (action.type) {
    case "start":
      return { lugares: null, total: 0, loading: true, error: null };
    case "success":
      return { lugares: action.lugares, total: action.total, loading: false, error: null };
    case "error":
      return { lugares: null, total: 0, loading: false, error: action.message };
  }
}

export function useLugares(filtro: LugarFiltro, reintento: number): LugaresState {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    let active = true;
    dispatch({ type: "start" });

    getLugares(filtro)
      .then((res) => {
        if (active) dispatch({ type: "success", lugares: res.items, total: res.total });
      })
      .catch((err: unknown) => {
        if (active) {
          dispatch({
            type: "error",
            message: err instanceof Error ? err.message : "Error desconocido",
          });
        }
      });

    return () => {
      active = false;
    };
  }, [filtro, reintento]);

  return state;
}
