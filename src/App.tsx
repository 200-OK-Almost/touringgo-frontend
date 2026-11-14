import {Routes, Route, Navigate } from "react-router-dom";
import './App.css'

import AuthCallback from "./features/auth/AuthCallback.tsx"
import HomePage from "./pages/HomePage.tsx";
import PlanificacionPage from "./pages/PlanificacionPage.tsx";
import ViajePage from "./pages/ViajePage.tsx";

function App() {
    return (
    <Routes>
        <Route path="/auth/callback" element={<AuthCallback/>}/>
        <Route path="/" element={<HomePage/>} />
        <Route path="/planificacion" element={<PlanificacionPage/>} />
        <Route path="/viajes/:id" element={<ViajePage/>} />
        <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    )
}

export default App
