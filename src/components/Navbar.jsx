import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav style={{ background: '#1a3a5c', padding: '0 16px', height: '48px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ color: 'white', fontWeight: '700', fontSize: '17px' }}>GYMWOLF</span>
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        {usuario?.rol === 'admin' ? (
          <>
            <NavLink to="/">Dashboard</NavLink>
            <NavLink to="/miembros">Miembros</NavLink>
            <NavLink to="/membresias">Membresías</NavLink>
            <NavLink to="/rutinas">Rutinas</NavLink>
            <NavLink to="/pagos">Pagos</NavLink>
          </>
        ) : (
          <NavLink to="/mi-panel">Mi Panel</NavLink>
        )}
        <span style={{ background: '#2e6da4', color: 'white', padding: '3px 10px',
          borderRadius: '20px', fontSize: '11px', fontWeight: '600' }}>
          {usuario?.nombre}
        </span>
        <button onClick={handleLogout} style={{ background: 'transparent',
          border: '1px solid rgba(255,255,255,0.35)', color: 'white',
          padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}>
          Salir
        </button>
      </div>
    </nav>
  )
}

function NavLink({ to, children }) {
  return (
    <Link to={to} style={{ color: 'white', textDecoration: 'none',
      border: '1px solid rgba(255,255,255,0.3)', padding: '4px 10px',
      borderRadius: '6px', fontSize: '11px' }}>
      {children}
    </Link>
  )
}
