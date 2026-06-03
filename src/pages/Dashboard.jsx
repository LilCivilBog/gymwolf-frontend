// Archivo: src/pages/Dashboard.jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default function Dashboard() {
  const [miembros, setMiembros] = useState([])
  const [pagos, setPagos]       = useState([])

  useEffect(() => {
    axios.get('/miembros').then(r => setMiembros(r.data)).catch(() => {})
    axios.get('/pagos').then(r => setPagos(r.data)).catch(() => {})
  }, [])

  const activos  = miembros.filter(m => m.estado).length
  const ingresos = pagos.filter(p => p.estado === 'pagado').reduce((s, p) => s + p.monto, 0)

  return (
    <div style={{ padding: '16px' }}>
      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'10px', marginBottom:'14px' }}>
        {[
          { val: activos,                   lbl: 'Miembros activos' },
          { val: miembros.length,           lbl: 'Total miembros' },
          { val: pagos.length,              lbl: 'Pagos registrados' },
          { val: `$${ingresos.toLocaleString()}`, lbl: 'Total ingresos' },
        ].map((s, i) => (
          <div key={i} style={{ background:'#eaf3fb', borderRadius:'8px', padding:'12px', textAlign:'center' }}>
            <div style={{ fontSize:'22px', fontWeight:'700', color:'#1a3a5c' }}>{s.val}</div>
            <div style={{ fontSize:'11px', color:'#555', marginTop:'2px' }}>{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* Tabla miembros recientes */}
      <div style={{ background:'white', borderRadius:'10px', border:'0.5px solid #dce8f0', padding:'14px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'10px' }}>
          <span style={{ fontWeight:'700', color:'#1a3a5c' }}>Miembros recientes</span>
          <Link to="/miembros" style={{ background:'#2e6da4', color:'white', padding:'4px 12px',
            borderRadius:'6px', fontSize:'12px', textDecoration:'none' }}>Ver todos</Link>
        </div>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'13px' }}>
          <thead>
            <tr style={{ background:'#1a3a5c' }}>
              {['Nombre','Correo','Estado'].map(h => (
                <th key={h} style={{ color:'white', padding:'7px 10px', textAlign:'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {miembros.slice(0,5).map((m, i) => (
              <tr key={m._id} style={{ background: i%2===0 ? 'white' : '#f8fbfd' }}>
                <td style={{ padding:'7px 10px', fontWeight:'600', color:'#1a3a5c' }}>{m.nombre}</td>
                <td style={{ padding:'7px 10px', color:'#555' }}>{m.correo}</td>
                <td style={{ padding:'7px 10px' }}>
                  <span style={{ background: m.estado ? '#e6f4ea':'#fdecea',
                    color: m.estado ? '#2e7d32':'#c62828',
                    padding:'2px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:'600' }}>
                    {m.estado ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
