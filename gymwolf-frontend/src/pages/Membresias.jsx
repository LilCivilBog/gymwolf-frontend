// ══════════════════════════════════
// src/pages/Membresias.jsx
// ══════════════════════════════════
import { useEffect, useState } from 'react'
import axios from 'axios'

export function Membresias() {
  const [lista, setLista] = useState([])
  const [modal, setModal] = useState(false)
  const [form, setForm]   = useState({ nombre:'', tipo:'mensual', precio:'', duracionDias:'', descripcion:'' })
  const [msg, setMsg]     = useState('')

  const cargar = () => axios.get('/membresias').then(r => setLista(r.data)).catch(()=>{})
  useEffect(() => { cargar() }, [])

  const guardar = async () => {
    try {
      await axios.post('/membresias', form)
      setModal(false); setForm({ nombre:'', tipo:'mensual', precio:'', duracionDias:'', descripcion:'' })
      setMsg('✅ Plan creado'); cargar(); setTimeout(()=>setMsg(''),3000)
    } catch(err){ setMsg('❌ '+(err.response?.data?.error||'Error')) }
  }

  const eliminar = async (id) => {
    if(!confirm('¿Eliminar este plan?')) return
    await axios.delete(`/membresias/${id}`); cargar()
  }

  const inp = {width:'100%',padding:'7px 10px',border:'1px solid #ccc',borderRadius:'6px',fontSize:'13px',color:'#222',marginBottom:'8px'}

  return (
    <div style={{padding:'16px'}}>
      <div style={{background:'white',borderRadius:'10px',border:'0.5px solid #dce8f0',padding:'14px'}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'12px'}}>
          <span style={{fontWeight:'700',color:'#1a3a5c',fontSize:'15px'}}>Planes de Membresía</span>
          <button onClick={()=>setModal(true)} style={{background:'#2e7d32',color:'white',border:'none',padding:'6px 14px',borderRadius:'6px',cursor:'pointer',fontWeight:'600',fontSize:'12px'}}>+ Nuevo plan</button>
        </div>
        {msg && <div style={{marginBottom:'10px',fontSize:'13px',color:msg.includes('✅')?'#2e7d32':'#c62828'}}>{msg}</div>}
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'12px'}}>
          <thead><tr style={{background:'#1a3a5c'}}>
            {['Plan','Tipo','Precio','Duración',''].map(h=><th key={h} style={{color:'white',padding:'7px 8px',textAlign:'left'}}>{h}</th>)}
          </tr></thead>
          <tbody>{lista.map((m,i)=>(
            <tr key={m._id} style={{background:i%2===0?'white':'#f8fbfd'}}>
              <td style={{padding:'7px 8px',fontWeight:'600',color:'#1a3a5c'}}>{m.nombre}</td>
              <td style={{padding:'7px 8px'}}><span style={{background:'#e3f0fb',color:'#0d47a1',padding:'2px 9px',borderRadius:'20px',fontSize:'11px',fontWeight:'600'}}>{m.tipo}</span></td>
              <td style={{padding:'7px 8px',fontWeight:'600',color:'#2e7d32'}}>${m.precio.toLocaleString()} MXN</td>
              <td style={{padding:'7px 8px',color:'#555'}}>{m.duracionDias} días</td>
              <td style={{padding:'7px 8px'}}>
                <button onClick={()=>eliminar(m._id)} style={{background:'#c62828',color:'white',border:'none',padding:'3px 9px',borderRadius:'5px',cursor:'pointer',fontSize:'11px'}}>Eliminar</button>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      {modal && (
        <div style={{position:'fixed',top:0,left:0,width:'100%',height:'100%',background:'rgba(0,0,0,0.4)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:10}}>
          <div style={{background:'white',borderRadius:'12px',padding:'20px',width:'420px'}}>
            <div style={{fontWeight:'700',color:'#1a3a5c',fontSize:'15px',borderBottom:'1px solid #eee',paddingBottom:'10px',marginBottom:'14px'}}>Nuevo plan de membresía</div>
            {[['Nombre del plan','text','nombre','Plan Semestral'],['Precio (MXN)','number','precio','800'],['Duración en días','number','duracionDias','180']].map(([lbl,type,key,ph])=>(
              <div key={key}>
                <label style={{fontSize:'11px',fontWeight:'600',color:'#333',display:'block',marginBottom:'3px'}}>{lbl}</label>
                <input type={type} placeholder={ph} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})} style={inp}/>
              </div>
            ))}
            <label style={{fontSize:'11px',fontWeight:'600',color:'#333',display:'block',marginBottom:'3px'}}>Tipo</label>
            <select value={form.tipo} onChange={e=>setForm({...form,tipo:e.target.value})} style={inp}>
              <option value="mensual">Mensual</option><option value="trimestral">Trimestral</option><option value="anual">Anual</option>
            </select>
            {msg&&<div style={{color:'#c62828',fontSize:'12px',marginBottom:'8px'}}>{msg}</div>}
            <div style={{display:'flex',gap:'8px',justifyContent:'flex-end'}}>
              <button onClick={()=>setModal(false)} style={{background:'#888',color:'white',border:'none',padding:'6px 14px',borderRadius:'6px',cursor:'pointer',fontSize:'12px',fontWeight:'600'}}>Cancelar</button>
              <button onClick={guardar} style={{background:'#2e6da4',color:'white',border:'none',padding:'6px 14px',borderRadius:'6px',cursor:'pointer',fontSize:'12px',fontWeight:'600'}}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Membresias
