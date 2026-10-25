import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, type LoginResponseDTO } from "./AuthContext";


export default function AuthCallback() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const exchangePromise = useRef<Promise<LoginResponseDTO> | null>(null);

  const {login} = useAuth()

  useEffect(() => {
    async function exchangeCode() {
      try {
        if (!exchangePromise.current) {
          const params = new URLSearchParams(window.location.search);
          const code = params.get("code");

          if (!code) {
            throw new Error("The login code is missing.");
          }

          // Capture the code before removing it from the URL.
          window.history.replaceState(
            {},
            document.title,
            "/auth/callback",
          );

          exchangePromise.current = fetch(
            "/api/usuarios/auth/exchange",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ code }),
            },
          ).then(async (response) => {
            if (!response.ok) {
              throw new Error("The login code is invalid or expired.");
            }

            return (await response.json()) as LoginResponseDTO;
          });
        }

        const auth = await exchangePromise.current;

        login(auth);
        navigate("/", { replace: true });
      } catch {
        setError("Sign-in failed. Please try signing in again.");
      }
    }

    void exchangeCode();
  }, [navigate]);

  if (error) {
    return (
      <main>
        <h1>Sign-in failed</h1>
        <p>{error}</p>
        <button onClick={() => navigate("/", { replace: true })}>
          Return home
        </button>
      </main>
    );
  }

  return <main><p>Completing sign-in...</p></main>;
}
