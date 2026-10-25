import Navbar from "../components/layout/Navbar";
import { useAuth } from "../features/auth/AuthContext";

const HomePage = () => {
    const { auth, isAuthenticated } = useAuth();
  
    return (
    <>
    <Navbar />
    <main>
        {isAuthenticated ? (
            <p>Bienvenido, {auth!.usuario.nombre}!</p>
        ) : (
            <p>Aún no has iniciado sesión.</p>
        )}
    </main>
    </>
    );
}
export default HomePage
