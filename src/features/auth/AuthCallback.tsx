import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function AuthCallback() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  useEffect(() => {
    async function completeSignIn() {
      try {
        await checkAuth();
        navigate("/", { replace: true });
      } catch {
        setError("No se pudo completar el inicio de sesión. Por favor, intenta de nuevo.");
      }
    }

    void completeSignIn();
  }, [checkAuth, navigate]);

  if (error) {
    return (
      <main style={{ padding: "2rem", textAlign: "center" }}>
        <h1>Error al iniciar sesión</h1>
        <p>{error}</p>
        <button onClick={() => navigate("/", { replace: true })}>
          Volver al inicio
        </button>
      </main>
    );
  }

  return (
    <main style={{ padding: "2rem", textAlign: "center" }}>
      <p>Completando inicio de sesión...</p>
    </main>
  );
}
