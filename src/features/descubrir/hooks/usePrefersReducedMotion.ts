import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function leerPreferencia(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }

  return window.matchMedia(QUERY).matches;
}

export function usePrefersReducedMotion(): boolean {
  const [prefiereReducido, setPrefiereReducido] = useState(leerPreferencia);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const media = window.matchMedia(QUERY);
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefiereReducido(event.matches);
    };

    media.addEventListener?.("change", handleChange);
    return () => media.removeEventListener?.("change", handleChange);
  }, []);

  return prefiereReducido;
}
