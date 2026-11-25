import { useCallback, useSyncExternalStore } from "react";

const getServerSnapshot = () => 1024;

export function useViewportWidth(): number {
  const subscribe = useCallback((onStoreChange: () => void) => {
    window.addEventListener("resize", onStoreChange);
    return () => window.removeEventListener("resize", onStoreChange);
  }, []);

  const getSnapshot = useCallback(() => window.innerWidth, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
