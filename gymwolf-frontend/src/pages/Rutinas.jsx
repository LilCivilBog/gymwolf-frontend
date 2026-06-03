import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Rutinas() {
  const [lista, setLista] = useState([])
  const [filtro, setFiltro] = useState('todos')

  const cargar = () => axios.get('/rutinas').then(r => setLista(r.data)).catch(()=>{})
  useEffect(() => { cargar() }, [])

  const eliminar = async (id) => {
    if(!confirm('¿Eliminar esta rutina?')) return
    await axios.delete(`/rutinas/${id}`); cargar()
  }

  const filtradas = filtro === 'todos' ? lista : lista.filter(r => r.objetivo === filtro)

  const colores = { principiante:'#2e7d32', intermedio:'#1565c0', avanzado:'#c62828' }

  return (
    <div style={{padding:'16px'}}>
      <div style={{background:'white',borderRadius:'10px',border:'0.5px solid #dce8f0',padding:'14px'}}>
        <div style={{fontWeight:'700',color:'#1a3a5c',fontSize:'15px',marginBottom:'12px'}}>Rutinas de Entrenamiento</div>
        <div style={{display:'flex',gap:'6px',marginBottom:'14px',flexWrap:'wrap'}}>
          {['todos','Volumen','Definición','Principiante'].map(f=>(
            <button key={f} onClick={()=>setFiltro(f)}
              style={{padding:'5px 14px',borderRadius:'20px',border:'1px solid #cdd5dd',
                background: filtro===f?'#1a3a5c':'white', color: filtro===f?'white':'#333',
                cursor:'pointer',fontSize:'12px',fontWeight:'500'}}>
              {f==='todos'?'Todas':f}
            </button>
          ))}
        </div>
        {filtradas.length === 0 && (
          <p style={{color:'#888',fontSize:'13px',textAlign:'center',padding:'20px'}}>
            No hay rutinas registradas. Agrega la primera desde la API.
          </p>
        )}
        {filtradas.map(r => (
          <div key={r._id} style={{background:'#f8fbfd',borderRadius:'8px',border:'1px solid #dce8f0',padding:'12px',marginBottom:'10px'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'6px'}}>
              <div>
                <strong style={{color:'#1a3a5c',fontSize:'14px'}}>{r.nombre}</strong>
                <span style={{background:`${colores[r.nivel]}18`,color:colores[r.nivel],
                  border:`1px solid ${colores[r.nivel]}40`,padding:'2px 9px',
                  borderRadius:'20px',fontSize:'11px',fontWeight:'600',marginLeft:'8px'}}>
                  {r.nivel}
                </span>
                <span style={{background:'#eee',color:'#333',padding:'2px 9px',
                  borderRadius:'20px',fontSize:'11px',marginLeft:'6px'}}>
                  {r.objetivo}
                </span>
              </div>
              <div style={{display:'flex',gap:'6px',alignItems:'center'}}>
                <span style={{fontSize:'12px',fontWeight:'700',color:colores[r.nivel]}}>
                  {r.costoExtra > 0 ? `$${r.costoExtra} MXN extra` : 'Incluida'}
                </span>
                <button onClick={()=>eliminar(r._id)}
                  style={{background:'#c62828',color:'white',border:'none',padding:'3px 9px',
                    borderRadius:'5px',cursor:'pointer',fontSize:'11px'}}>
                  Eliminar
                </button>
              </div>
            </div>
            <p style={{fontSize:'12px',color:'#555',marginBottom:'8px'}}>{r.descripcion}</p>
            <div style={{fontSize:'11px',color:'#888'}}>{r.duracionSemanas} semanas</div>
            {r.ejercicios?.length > 0 && (
              <div style={{display:'flex',flexWrap:'wrap',gap:'4px',marginTop:'8px'}}>
                {r.ejercicios.map((e,i)=>(
                  <span key={i} style={{background:'#dde4ec',border:'1px solid #b8c8d8',
                    padding:'3px 10px',borderRadius:'20px',fontSize:'12px',color:'#1a3a5c'}}>
                    <strong>{e.nombre}</strong> {e.series}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
