// ══════════════════════════════════
// src/pages/Pagos.jsx
// ══════════════════════════════════
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Pagos() {
  const [pagos, setPagos]   = useState([])
  const [miembros, setMiembros] = useState([])
  const [modal, setModal]   = useState(false)
  const [form, setForm]     = useState({ miembro_id:'', concepto:'membresía mensual', monto:'', metodoPago:'efectivo', estado:'pagado' })
  const [msg, setMsg]       = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [busquedaMiembro, setBusquedaMiembro] = useState('')
  const [miembroNombre, setMiembroNombre] = useState('')
  const [mostrarDropdown, setMostrarDropdown] = useState(false)

  const cargar = () => {
    axios.get('/pagos').then(r => setPagos(r.data)).catch(()=>{})
    axios.get('/miembros').then(r => setMiembros(r.data)).catch(()=>{})
  }
  useEffect(() => { cargar() }, [])

  const guardar = async () => {
    try {
      await axios.post('/pagos', form)
      setModal(false)
      setForm({ miembro_id:'', concepto:'membresía mensual', monto:'', metodoPago:'efectivo', estado:'pagado' })
      setBusquedaMiembro(''); setMiembroNombre('')
      setMsg('✅ Pago registrado'); cargar(); setTimeout(()=>setMsg(''),3000)
    } catch(err){ setMsg('❌ '+(err.response?.data?.error||'Error')) }
  }

  const miembrosNoAdmin = miembros.filter(m => m.rol !== 'admin')
  const miembrosFiltradosModal = miembrosNoAdmin.filter(m =>
    m.nombre.toLowerCase().includes(busquedaMiembro.toLowerCase()) ||
    m.correo.toLowerCase().includes(busquedaMiembro.toLowerCase())
  )

  const pagosFiltrados = pagos.filter(p =>
    !busqueda || p.miembro_id?.nombre?.toLowerCase().includes(busqueda.toLowerCase())
  )

  const inp = {width:'100%',padding:'7px 10px',border:'1px solid #ccc',borderRadius:'6px',fontSize:'13px',color:'#222',marginBottom:'8px'}

  return (
    <div style={{padding:'16px'}}>
      <div style={{background:'white',borderRadius:'10px',border:'0.5px solid #dce8f0',padding:'14px'}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'12px'}}>
          <span style={{fontWeight:'700',color:'#1a3a5c',fontSize:'15px'}}>Registro de Pagos</span>
          <button onClick={()=>{ setModal(true); setBusquedaMiembro(''); setMiembroNombre(''); setMostrarDropdown(false); setForm({ miembro_id:'', concepto:'membresía mensual', monto:'', metodoPago:'efectivo', estado:'pagado' }) }} style={{background:'#2e7d32',color:'white',border:'none',padding:'6px 14px',borderRadius:'6px',cursor:'pointer',fontWeight:'600',fontSize:'12px'}}>+ Registrar pago</button>
        </div>
        {msg && <div style={{marginBottom:'10px',fontSize:'13px',color:msg.includes('✅')?'#2e7d32':'#c62828'}}>{msg}</div>}
        <div style={{position:'relative',marginBottom:'10px'}}>
          <span style={{position:'absolute',left:'10px',top:'50%',transform:'translateY(-50%)',color:'#888',fontSize:'13px'}}>🔍</span>
          <input type="text" placeholder="Buscar por nombre de miembro..."
            value={busqueda} onChange={e => setBusqueda(e.target.value)}
            style={{width:'100%',padding:'7px 10px 7px 32px',border:'1px solid #ccc',
              borderRadius:'6px',fontSize:'13px',color:'#222',boxSizing:'border-box'}} />
        </div>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'12px'}}>
          <thead><tr style={{background:'#1a3a5c'}}>
            {['Miembro','Concepto','Monto','Método','Estado','Fecha'].map(h=><th key={h} style={{color:'white',padding:'7px 8px',textAlign:'left'}}>{h}</th>)}
          </tr></thead>
          <tbody>{pagosFiltrados.map((p,i)=>(
            <tr key={p._id} style={{background:i%2===0?'white':'#f8fbfd'}}>
              <td style={{padding:'7px 8px',fontWeight:'600',color:'#1a3a5c'}}>{p.miembro_id?.nombre || '-'}</td>
              <td style={{padding:'7px 8px',color:'#555'}}>{p.concepto}</td>
              <td style={{padding:'7px 8px',fontWeight:'700',color:'#2e7d32'}}>${p.monto.toLocaleString()}</td>
              <td style={{padding:'7px 8px',color:'#555'}}>{p.metodoPago}</td>
              <td style={{padding:'7px 8px'}}>
                <span style={{background:p.estado==='pagado'?'#e6f4ea':'#fff3e0',color:p.estado==='pagado'?'#2e7d32':'#bf360c',padding:'2px 9px',borderRadius:'20px',fontSize:'11px',fontWeight:'600'}}>{p.estado}</span>
              </td>
              <td style={{padding:'7px 8px',color:'#555',fontSize:'11px'}}>{new Date(p.fechaPago).toLocaleDateString('es-MX')}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      {modal && (
        <div style={{position:'fixed',top:0,left:0,width:'100%',height:'100%',background:'rgba(0,0,0,0.4)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:10}}>
          <div style={{background:'white',borderRadius:'12px',padding:'20px',width:'420px'}}>
            <div style={{fontWeight:'700',color:'#1a3a5c',fontSize:'15px',borderBottom:'1px solid #eee',paddingBottom:'10px',marginBottom:'14px'}}>Registrar pago</div>
            <label style={{fontSize:'11px',fontWeight:'600',color:'#333',display:'block',marginBottom:'3px'}}>Miembro</label>
            <div style={{position:'relative',marginBottom:'8px'}}>
              <div style={{position:'relative'}}>
                <span style={{position:'absolute',left:'10px',top:'50%',transform:'translateY(-50%)',color:'#888',fontSize:'13px'}}>🔍</span>
                <input
                  type="text"
                  placeholder="Buscar miembro por nombre o correo..."
                  value={busquedaMiembro}
                  onChange={e => { setBusquedaMiembro(e.target.value); setMostrarDropdown(true) }}
                  onFocus={() => setMostrarDropdown(true)}
                  style={{width:'100%',padding:'7px 10px 7px 32px',border:'1px solid #ccc',borderRadius:'6px',fontSize:'13px',color:'#222',boxSizing:'border-box'}}
                />
              </div>
              {miembroNombre && !mostrarDropdown && (
                <div style={{fontSize:'12px',color:'#2e6da4',marginTop:'3px',fontWeight:'600'}}>✔ {miembroNombre}</div>
              )}
              {mostrarDropdown && busquedaMiembro && (
                <div style={{position:'absolute',top:'100%',left:0,right:0,background:'white',border:'1px solid #ccc',borderRadius:'6px',maxHeight:'180px',overflowY:'auto',zIndex:20,boxShadow:'0 4px 12px rgba(0,0,0,0.1)'}}>
                  {miembrosFiltradosModal.length === 0 ? (
                    <div style={{padding:'10px',color:'#888',fontSize:'12px'}}>Sin resultados</div>
                  ) : miembrosFiltradosModal.map(m => (
                    <div key={m._id}
                      onClick={() => { setForm({...form, miembro_id: m._id}); setMiembroNombre(m.nombre); setBusquedaMiembro(m.nombre); setMostrarDropdown(false) }}
                      style={{padding:'8px 12px',cursor:'pointer',fontSize:'13px',borderBottom:'0.5px solid #eee'}}
                      onMouseEnter={e => e.currentTarget.style.background='#eaf3fb'}
                      onMouseLeave={e => e.currentTarget.style.background='white'}>
                      <strong>{m.nombre}</strong> <span style={{color:'#888',fontSize:'11px'}}>{m.correo}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
              <div>
                <label style={{fontSize:'11px',fontWeight:'600',color:'#333',display:'block',marginBottom:'3px'}}>Concepto</label>
                <select value={form.concepto} onChange={e=>setForm({...form,concepto:e.target.value})} style={inp}>
                  <option value="membresía mensual">Membresía mensual</option>
                  <option value="membresía trimestral">Membresía trimestral</option>
                  <option value="membresía anual">Membresía anual</option>
                  <option value="membresía 15 días">Membresía 15 días</option>
                  <option value="membresía 1 día">Membresía 1 día</option>
                  <option value="rutina">Rutina</option>
                  <option value="dieta personalizada">Dieta personalizada</option>
                  <option value="consulta coach">Consulta coach</option>
                </select>
              </div>
              <div>
                <label style={{fontSize:'11px',fontWeight:'600',color:'#333',display:'block',marginBottom:'3px'}}>Monto (MXN)</label>
                <input type="number" placeholder="500" value={form.monto} onChange={e=>setForm({...form,monto:e.target.value})} style={inp}/>
              </div>
              <div>
                <label style={{fontSize:'11px',fontWeight:'600',color:'#333',display:'block',marginBottom:'3px'}}>Método de pago</label>
                <select value={form.metodoPago} onChange={e=>setForm({...form,metodoPago:e.target.value})} style={inp}>
                  <option value="efectivo">Efectivo</option><option value="tarjeta">Tarjeta</option><option value="transferencia">Transferencia</option>
                </select>
              </div>
              <div>
                <label style={{fontSize:'11px',fontWeight:'600',color:'#333',display:'block',marginBottom:'3px'}}>Estado</label>
                <select value={form.estado} onChange={e=>setForm({...form,estado:e.target.value})} style={inp}>
                  <option value="pagado">Pagado</option><option value="pendiente">Pendiente</option>
                </select>
              </div>
            </div>
            {msg&&<div style={{color:'#c62828',fontSize:'12px',marginBottom:'8px'}}>{msg}</div>}
            <div style={{display:'flex',gap:'8px',justifyContent:'flex-end'}}>
              <button onClick={()=>{ setModal(false); setBusquedaMiembro(''); setMiembroNombre(''); setMostrarDropdown(false) }} style={{background:'#888',color:'white',border:'none',padding:'6px 14px',borderRadius:'6px',cursor:'pointer',fontSize:'12px',fontWeight:'600'}}>Cancelar</button>
              <button onClick={guardar} style={{background:'#2e6da4',color:'white',border:'none',padding:'6px 14px',borderRadius:'6px',cursor:'pointer',fontSize:'12px',fontWeight:'600'}}>Registrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
