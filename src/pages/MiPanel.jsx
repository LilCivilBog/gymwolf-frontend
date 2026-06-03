import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

export default function MiPanel() {
  const { usuario } = useAuth()
  const [pagos, setPagos] = useState([])
  const [miembro, setMiembro] = useState(null)

  useEffect(() => {
    // Buscar datos del miembro actual
    axios.get('/miembros').then(r => {
      const yo = r.data.find(m => m.correo === usuario?.email)
      if(yo) {
        setMiembro(yo)
        axios.get(`/pagos/miembro/${yo._id}`).then(p => setPagos(p.data)).catch(()=>{})
      }
    }).catch(()=>{})
  }, [])

  return (
    <div style={{padding:'16px'}}>
      <div style={{background:'white',borderRadius:'10px',border:'0.5px solid #dce8f0',padding:'14px',marginBottom:'12px'}}>
        <div style={{fontWeight:'700',color:'#1a3a5c',fontSize:'16px',marginBottom:'14px'}}>
          Hola, {usuario?.nombre} 👋
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'14px'}}>
          {/* Membresía */}
          <div style={{background:'#f8fbfd',borderRadius:'8px',border:'1px solid #dce8f0',padding:'12px'}}>
            <div style={{background:'#1a3a5c',color:'white',padding:'7px 10px',borderRadius:'6px',fontSize:'12px',fontWeight:'700',marginBottom:'10px'}}>
              MI MEMBRESÍA
            </div>
            {miembro?.membresia_id ? (
              <>
                <div style={{display:'flex',justifyContent:'space-between',padding:'4px 0',borderBottom:'0.5px solid #eee',fontSize:'12px'}}>
                  <span style={{color:'#666'}}>Plan</span><span style={{fontWeight:'600',color:'#1a3a5c'}}>{miembro.membresia_id.nombre}</span>
                </div>
                <div style={{display:'flex',justifyContent:'space-between',padding:'4px 0',fontSize:'12px'}}>
                  <span style={{color:'#666'}}>Precio</span><span style={{fontWeight:'600',color:'#1a3a5c'}}>${miembro.membresia_id.precio} MXN</span>
                </div>
              </>
            ) : <p style={{color:'#888',fontSize:'12px'}}>Sin membresía asignada</p>}
            <span style={{background:'#e6f4ea',color:'#2e7d32',padding:'2px 10px',borderRadius:'20px',fontSize:'11px',fontWeight:'600',marginTop:'8px',display:'inline-block'}}>Activa</span>
          </div>

          {/* Rutina */}
          <div style={{background:'#f8fbfd',borderRadius:'8px',border:'1px solid #dce8f0',padding:'12px'}}>
            <div style={{background:'#2e6da4',color:'white',padding:'7px 10px',borderRadius:'6px',fontSize:'12px',fontWeight:'700',marginBottom:'10px'}}>
              MI RUTINA DEL MES
            </div>
            {miembro?.rutina_id ? (
              <>
                <div style={{display:'flex',justifyContent:'space-between',padding:'4px 0',borderBottom:'0.5px solid #eee',fontSize:'12px'}}>
                  <span style={{color:'#666'}}>Rutina</span><span style={{fontWeight:'600',color:'#1a3a5c'}}>{miembro.rutina_id.nombre}</span>
                </div>
                <div style={{display:'flex',justifyContent:'space-between',padding:'4px 0',fontSize:'12px'}}>
                  <span style={{color:'#666'}}>Nivel</span><span style={{fontWeight:'600',color:'#1a3a5c'}}>{miembro.rutina_id.nivel}</span>
                </div>
              </>
            ) : <p style={{color:'#888',fontSize:'12px'}}>Sin rutina asignada</p>}
          </div>
        </div>

        {/* Historial pagos */}
        <div style={{fontWeight:'700',color:'#1a3a5c',fontSize:'14px',marginBottom:'10px'}}>Mis pagos</div>
        {pagos.length === 0
          ? <p style={{color:'#888',fontSize:'13px'}}>Sin pagos registrados</p>
          : <table style={{width:'100%',borderCollapse:'collapse',fontSize:'12px'}}>
              <thead><tr style={{background:'#1a3a5c'}}>
                {['Concepto','Monto','Método','Estado','Fecha'].map(h=><th key={h} style={{color:'white',padding:'6px 8px',textAlign:'left'}}>{h}</th>)}
              </tr></thead>
              <tbody>{pagos.map((p,i)=>(
                <tr key={p._id} style={{background:i%2===0?'white':'#f8fbfd'}}>
                  <td style={{padding:'6px 8px',color:'#555'}}>{p.concepto}</td>
                  <td style={{padding:'6px 8px',fontWeight:'700',color:'#2e7d32'}}>${p.monto.toLocaleString()}</td>
                  <td style={{padding:'6px 8px',color:'#555'}}>{p.metodoPago}</td>
                  <td style={{padding:'6px 8px'}}><span style={{background:p.estado==='pagado'?'#e6f4ea':'#fff3e0',color:p.estado==='pagado'?'#2e7d32':'#bf360c',padding:'2px 9px',borderRadius:'20px',fontSize:'11px',fontWeight:'600'}}>{p.estado}</span></td>
                  <td style={{padding:'6px 8px',color:'#888',fontSize:'11px'}}>{new Date(p.fechaPago).toLocaleDateString('es-MX')}</td>
                </tr>
              ))}</tbody>
            </table>
        }
      </div>
    </div>
  )
}
