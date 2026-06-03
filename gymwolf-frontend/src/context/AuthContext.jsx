import { createContext, useContext, useState } from 'react'
import axios from 'axios'

// Configuración global de axios — todas las peticiones van al backend
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
axios.defaults.withCredentials = true  // para enviar cookies con el token

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)

  const login = async (correo, password) => {
    const res = await axios.post('/auth/login', { correo, password })
    setUsuario({ nombre: res.data.nombre, rol: res.data.rol })
    return res.data.rol
  }

  const logout = async () => {
    await axios.get('/auth/logout')
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
