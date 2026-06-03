import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const adminLinks = [
  { path: '/',             label: 'Dashboard'    },
  { path: '/miembros',     label: 'Miembros'     },
  { path: '/membresias',   label: 'Membresías'   },
  { path: '/rutinas',      label: 'Rutinas'      },
  { path: '/asignar-plan', label: 'Asignar Plan' },
  { path: '/dietas',       label: 'Dietas'       },
  { path: '/pagos',        label: 'Pagos'        },
]

export default function Navbar() {
  const { usuario, logout } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const navBtnStyle = (path) => ({
    color: 'white',
    textDecoration: 'none',
    padding: '5px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: location.pathname === path ? '700' : '400',
    background: location.pathname === path ? '#2e6da4' : 'transparent',
    border: location.pathname === path
      ? '1px solid #5a9fd4'
      : '1px solid rgba(255,255,255,0.3)',
    transition: 'all 0.2s',
  })

  return (
    <nav style={{ background: '#1a3a5c', padding: '0 16px', height: '48px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ color: 'white', fontWeight: '700', fontSize: '17px' }}>GYMWOLF</span>
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        {usuario?.rol === 'admin' ? (
          adminLinks.map(link => (
            <Link key={link.path} to={link.path} style={navBtnStyle(link.path)}>
              {link.label}
            </Link>
          ))
        ) : (
          <Link to="/mi-panel" style={navBtnStyle('/mi-panel')}>Mi Panel</Link>
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
