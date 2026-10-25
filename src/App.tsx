import {Routes, Route, Navigate } from "react-router-dom";
import './App.css'

import AuthCallback from "./features/auth/AuthCallback.tsx"
import HomePage from "./pages/HomePage.tsx";

function App() {
    return (
    <Routes>
        <Route path="/auth/callback" element={<AuthCallback/>}/>
        <Route path="/" element={<HomePage/>} />
        <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    )
}

export default App
