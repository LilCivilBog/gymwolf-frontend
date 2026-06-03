import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Miembros() {
  const [miembros, setMiembros] = useState([])
  const [modal, setModal]       = useState(false)
  const [form, setForm]         = useState({ nombre:'', correo:'', telefono:'', password:'', rol:'miembro' })
  const [msg, setMsg]           = useState('')

  const cargar = () => axios.get('/miembros').then(r => setMiembros(r.data)).catch(() => {})
  useEffect(() => { cargar() }, [])

  const guardar = async () => {
    try {
      await axios.post('/miembros', form)
      setModal(false)
      setForm({ nombre:'', correo:'', telefono:'', password:'', rol:'miembro' })
      setMsg('✅ Miembro agregado')
      cargar()
      setTimeout(() => setMsg(''), 3000)
    } catch (err) { setMsg('❌ ' + (err.response?.data?.error || 'Error')) }
  }

  const toggleEstado = async (m) => {
    await axios.put(`/miembros/${m._id}`, { estado: !m.estado })
    cargar()
  }

  const eliminar = async (id) => {
    if (!confirm('¿Eliminar este miembro?')) return
    await axios.delete(`/miembros/${id}`)
    cargar()
  }

  const inp = { width:'100%', padding:'7px 10px', border:'1px solid #ccc',
    borderRadius:'6px', fontSize:'13px', color:'#222', marginBottom:'8px' }

  return (
    <div style={{ padding:'16px' }}>
      <div style={{ background:'white', borderRadius:'10px', border:'0.5px solid #dce8f0', padding:'14px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'12px' }}>
          <span style={{ fontWeight:'700', color:'#1a3a5c', fontSize:'15px' }}>Gestión de Miembros</span>
          <button onClick={() => setModal(true)}
            style={{ background:'#2e7d32', color:'white', border:'none', padding:'6px 14px',
              borderRadius:'6px', cursor:'pointer', fontWeight:'600', fontSize:'12px' }}>
            + Nuevo miembro
          </button>
        </div>
        {msg && <div style={{ marginBottom:'10px', color: msg.includes('✅') ? '#2e7d32':'#c62828', fontSize:'13px' }}>{msg}</div>}
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'12px' }}>
          <thead>
            <tr style={{ background:'#1a3a5c' }}>
              {['#','Nombre','Correo','Teléfono','Estado','Acciones'].map(h => (
                <th key={h} style={{ color:'white', padding:'7px 8px', textAlign:'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {miembros.map((m, i) => (
              <tr key={m._id} style={{ background: i%2===0?'white':'#f8fbfd' }}>
                <td style={{ padding:'7px 8px', color:'#555' }}>{String(i+1).padStart(3,'0')}</td>
                <td style={{ padding:'7px 8px', fontWeight:'600', color:'#1a3a5c' }}>{m.nombre}</td>
                <td style={{ padding:'7px 8px', color:'#555' }}>{m.correo}</td>
                <td style={{ padding:'7px 8px', color:'#555' }}>{m.telefono}</td>
                <td style={{ padding:'7px 8px' }}>
                  <span style={{ background: m.estado?'#e6f4ea':'#fdecea',
                    color: m.estado?'#2e7d32':'#c62828', padding:'2px 9px',
                    borderRadius:'20px', fontSize:'11px', fontWeight:'600' }}>
                    {m.estado ? 'Activo':'Inactivo'}
                  </span>
                </td>
                <td style={{ padding:'7px 8px' }}>
                  <button onClick={() => toggleEstado(m)}
                    style={{ background:'#2e6da4', color:'white', border:'none', padding:'3px 9px',
                      borderRadius:'5px', cursor:'pointer', fontSize:'11px', marginRight:'4px' }}>
                    {m.estado ? 'Dar de baja':'Activar'}
                  </button>
                  <button onClick={() => eliminar(m._id)}
                    style={{ background:'#c62828', color:'white', border:'none', padding:'3px 9px',
                      borderRadius:'5px', cursor:'pointer', fontSize:'11px' }}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal nuevo miembro */}
      {modal && (
        <div style={{ position:'fixed', top:0, left:0, width:'100%', height:'100%',
          background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:10 }}>
          <div style={{ background:'white', borderRadius:'12px', padding:'20px', width:'440px' }}>
            <div style={{ fontWeight:'700', color:'#1a3a5c', fontSize:'15px',
              borderBottom:'1px solid #eee', paddingBottom:'10px', marginBottom:'14px' }}>
              Agregar nuevo miembro
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
              {[
                ['Nombre completo','text','nombre','Juan López'],
                ['Correo','email','correo','juan@mail.com'],
                ['Teléfono','text','telefono','4921234567'],
                ['Contraseña','password','password','••••••••'],
              ].map(([lbl,type,key,ph]) => (
                <div key={key}>
                  <label style={{ fontSize:'11px', fontWeight:'600', color:'#333', display:'block', marginBottom:'3px' }}>{lbl}</label>
                  <input type={type} placeholder={ph} value={form[key]}
                    onChange={e => setForm({...form, [key]: e.target.value})} style={inp} />
                </div>
              ))}
            </div>
            <div>
              <label style={{ fontSize:'11px', fontWeight:'600', color:'#333', display:'block', marginBottom:'3px' }}>Rol</label>
              <select value={form.rol} onChange={e => setForm({...form, rol: e.target.value})} style={inp}>
                <option value="miembro">Miembro</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            {msg && <div style={{ color:'#c62828', fontSize:'12px', marginBottom:'8px' }}>{msg}</div>}
            <div style={{ display:'flex', gap:'8px', justifyContent:'flex-end' }}>
              <button onClick={() => setModal(false)}
                style={{ background:'#888', color:'white', border:'none', padding:'6px 14px',
                  borderRadius:'6px', cursor:'pointer', fontSize:'12px', fontWeight:'600' }}>
                Cancelar
              </button>
              <button onClick={guardar}
                style={{ background:'#2e6da4', color:'white', border:'none', padding:'6px 14px',
                  borderRadius:'6px', cursor:'pointer', fontSize:'12px', fontWeight:'600' }}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
