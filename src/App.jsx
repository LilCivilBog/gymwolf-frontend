import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login       from './pages/Login'
import Dashboard   from './pages/Dashboard'
import Miembros    from './pages/Miembros'
import Membresias  from './pages/Membresias'
import Rutinas     from './pages/Rutinas'
import Pagos       from './pages/Pagos'
import MiPanel     from './pages/MiPanel'
import AsignarPlan from './pages/AsignarPlan'
import Dietas      from './pages/Dietas'
import Navbar      from './components/Navbar'

// Protege rutas — si no hay sesión, manda al login
function RutaProtegida({ children }) {
  const { usuario } = useAuth()
  return usuario ? children : <Navigate to="/login" />
}

function AppRoutes() {
  const { usuario } = useAuth()
  return (
    <>
      {usuario && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<RutaProtegida><Dashboard /></RutaProtegida>} />
        <Route path="/miembros"   element={<RutaProtegida><Miembros /></RutaProtegida>} />
        <Route path="/membresias" element={<RutaProtegida><Membresias /></RutaProtegida>} />
        <Route path="/rutinas"    element={<RutaProtegida><Rutinas /></RutaProtegida>} />
        <Route path="/pagos"      element={<RutaProtegida><Pagos /></RutaProtegida>} />
        <Route path="/mi-panel"     element={<RutaProtegida><MiPanel /></RutaProtegida>} />
        <Route path="/asignar-plan" element={<RutaProtegida><AsignarPlan /></RutaProtegida>} />
        <Route path="/dietas"       element={<RutaProtegida><Dietas /></RutaProtegida>} />
        <Route path="*"             element={<Navigate to="/" />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
