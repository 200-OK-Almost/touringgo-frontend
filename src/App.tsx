import {Routes, Route, Navigate } from "react-router-dom";
import './App.css'

import AuthCallback from "./features/auth/AuthCallback.tsx"
import HomePage from "./pages/HomePage.tsx";
import PlanificacionPage from "./pages/PlanificacionPage.tsx";
import ViajePage from "./pages/ViajePage.tsx";
import EncuestaPage from "./pages/EncuestaPage.tsx";
import { EncuestaRoute } from "./components/routes/EncuestaRoute.tsx";
import { ProtectedRoute } from "./components/routes/ProtectedRoute.tsx";
import { HomeRoute } from "./components/routes/HomeRoute.tsx";

function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/auth/callback" element={<AuthCallback/>}/>
      
      {/* Ruta Home: Anónimos o Logueados con encuesta lista */}
      <Route element={<HomeRoute />}>
        <Route path="/" element={<HomePage />} />
      </Route>

      {/* Solo para usuarios logueados pendientes de encuesta */}
      <Route element={<EncuestaRoute />}>
        <Route path="/encuesta-inicial" element={<EncuestaPage />} />
      </Route>

      {/* Rutas protegidas que requieren login y encuesta completa */}
      <Route element={<ProtectedRoute />}>
        <Route path="/planificacion" element={<PlanificacionPage />} />
        <Route path="/viajes/:id" element={<ViajePage />} />
      </Route>
      
      {/* Wildcard 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
