import { useEffect, useState } from 'react'
import axios from 'axios'

export default function MiPanel() {
  const [miembro, setMiembro] = useState(null)
  const [pagos, setPagos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const cargar = async () => {
      try {
        // Usar /auth/me que usa el token JWT directamente
        const res = await axios.get('/auth/me')
        setMiembro(res.data)
        // Cargar pagos
        try {
          const pRes = await axios.get(`/pagos/miembro/${res.data._id}`)
          setPagos(pRes.data)
        } catch { setPagos([]) }
      } catch (err) {
        setError('Error cargando tu perfil: ' + (err.response?.data?.error || err.message))
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [])

  if (cargando) return (
    <div style={{ padding:'40px', textAlign:'center', color:'#888' }}>
      <div style={{ fontSize:'24px', marginBottom:'8px' }}>⏳</div>
      Cargando tu información...
    </div>
  )

  if (error) return (
    <div style={{ padding:'40px', textAlign:'center' }}>
      <div style={{ color:'#c62828', fontSize:'14px', background:'#fdecea', padding:'16px', borderRadius:'8px' }}>
        {error}
      </div>
    </div>
  )

  if (!miembro) return (
    <div style={{ padding:'40px', textAlign:'center', color:'#888' }}>
      No se encontró tu perfil.
    </div>
  )

  const rutina = miembro.rutina_id
  const dieta = miembro.dieta_id
  const tienePlan = miembro.pagoBiotipo

  return (
    <div style={{ padding:'16px' }}>
      {/* Saludo */}
      <div style={{ background:'white', borderRadius:'10px', border:'0.5px solid #dce8f0', padding:'16px', marginBottom:'12px' }}>
        <div style={{ fontSize:'18px', fontWeight:'700', color:'#1a3a5c' }}>
          Hola, {miembro.nombre} 👋
        </div>
        <div style={{ fontSize:'12px', color: tienePlan ? '#2e7d32' : '#888', marginTop:'4px' }}>
          {tienePlan ? '✅ Plan personalizado activo' : '⭕ Plan básico — consulta con tu coach para personalizar'}
        </div>
      </div>

      {/* Membresía + Rutina */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'12px' }}>
        {/* Membresía */}
        <div style={{ background:'white', borderRadius:'10px', border:'0.5px solid #dce8f0', overflow:'hidden' }}>
          <div style={{ background:'#1a3a5c', color:'white', padding:'10px 14px', fontWeight:'700', fontSize:'13px' }}>
            MI MEMBRESÍA
          </div>
          <div style={{ padding:'12px' }}>
            {miembro.membresia_id ? (
              <>
                {[['Plan', miembro.membresia_id.nombre],['Tipo', miembro.membresia_id.tipo],['Precio', `$${miembro.membresia_id.precio} MXN`]].map(([l,v]) => (
                  <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'4px 0', borderBottom:'0.5px solid #eee', fontSize:'13px' }}>
                    <span style={{ color:'#888' }}>{l}</span>
                    <span style={{ fontWeight:'600', color:'#1a3a5c' }}>{v}</span>
                  </div>
                ))}
                <span style={{ background:'#e6f4ea', color:'#2e7d32', padding:'2px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:'600', marginTop:'8px', display:'inline-block' }}>Activa</span>
              </>
            ) : <p style={{ color:'#888', fontSize:'13px' }}>Sin membresía asignada</p>}
          </div>
        </div>

        {/* Rutina */}
        <div style={{ background:'white', borderRadius:'10px', border:'0.5px solid #dce8f0', overflow:'hidden' }}>
          <div style={{ background:'#2e6da4', color:'white', padding:'10px 14px', fontWeight:'700', fontSize:'13px' }}>
            MI RUTINA DEL MES
          </div>
          <div style={{ padding:'12px' }}>
            {tienePlan && rutina ? (
              <>
                {[['Rutina', rutina.nombre],['Nivel', rutina.nivel],['Tipo', rutina.tipoEntrenamiento || rutina.objetivo],['Duración', rutina.duracionSemanas ? `${rutina.duracionSemanas} semanas` : null]].filter(([,v]) => v).map(([l,v]) => (
                  <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'4px 0', borderBottom:'0.5px solid #eee', fontSize:'13px' }}>
                    <span style={{ color:'#888' }}>{l}</span>
                    <span style={{ fontWeight:'600', color:'#1a3a5c' }}>{v}</span>
                  </div>
                ))}
              </>
            ) : (
              <div style={{ textAlign:'center', padding:'8px' }}>
                <div style={{ fontSize:'24px', marginBottom:'6px' }}>🔒</div>
                <p style={{ color:'#888', fontSize:'12px' }}>
                  {tienePlan ? 'Sin rutina asignada aún' : 'Agenda tu consulta con el coach'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Datos físicos */}
      {(miembro.peso || miembro.edad || miembro.objetivo) && (
        <div style={{ background:'white', borderRadius:'10px', border:'0.5px solid #dce8f0', padding:'14px', marginBottom:'12px' }}>
          <div style={{ fontWeight:'700', color:'#1a3a5c', fontSize:'14px', marginBottom:'10px' }}>MIS DATOS</div>
          <div style={{ display:'flex', gap:'12px', flexWrap:'wrap' }}>
            {miembro.peso && <div style={{ background:'#eaf3fb', padding:'8px 14px', borderRadius:'8px', textAlign:'center' }}><div style={{ fontWeight:'700', color:'#1a3a5c', fontSize:'18px' }}>{miembro.peso} kg</div><div style={{ fontSize:'11px', color:'#888' }}>Peso actual</div></div>}
            {miembro.edad && <div style={{ background:'#eaf3fb', padding:'8px 14px', borderRadius:'8px', textAlign:'center' }}><div style={{ fontWeight:'700', color:'#1a3a5c', fontSize:'18px' }}>{miembro.edad}</div><div style={{ fontSize:'11px', color:'#888' }}>Edad</div></div>}
            {miembro.objetivo && <div style={{ background:'#eaf3fb', padding:'8px 14px', borderRadius:'8px', textAlign:'center' }}><div style={{ fontWeight:'700', color:'#1a3a5c', fontSize:'16px' }}>{miembro.objetivo}</div><div style={{ fontSize:'11px', color:'#888' }}>Objetivo</div></div>}
          </div>
          {miembro.notasCoach && (
            <div style={{ marginTop:'10px', background:'#fff9c4', borderRadius:'8px', padding:'10px 12px', border:'1px solid #f9a825' }}>
              <strong style={{ fontSize:'12px', color:'#856404' }}>💬 Nota del coach:</strong>
              <p style={{ fontSize:'13px', color:'#555', margin:'4px 0 0' }}>{miembro.notasCoach}</p>
            </div>
          )}
        </div>
      )}

      {/* Ejercicios */}
      {tienePlan && rutina?.ejercicios?.length > 0 && (
        <div style={{ background:'white', borderRadius:'10px', border:'0.5px solid #dce8f0', padding:'14px', marginBottom:'12px' }}>
          <div style={{ fontWeight:'700', color:'#1a3a5c', fontSize:'14px', marginBottom:'10px' }}>EJERCICIOS DE MI RUTINA</div>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'12px' }}>
            <thead><tr style={{ background:'#1a3a5c' }}>
              {['Ejercicio','Series','Reps','Descanso','Cómo realizarlo'].map(h => <th key={h} style={{ color:'white', padding:'7px 8px', textAlign:'left' }}>{h}</th>)}
            </tr></thead>
            <tbody>{rutina.ejercicios.map((e,i) => (
              <tr key={i} style={{ background: i%2===0?'white':'#f8fbfd' }}>
                <td style={{ padding:'7px 8px', fontWeight:'600', color:'#1a3a5c' }}>{e.nombre}</td>
                <td style={{ padding:'7px 8px', color:'#555' }}>{e.series}</td>
                <td style={{ padding:'7px 8px', color:'#555' }}>{e.repeticiones}</td>
                <td style={{ padding:'7px 8px', color:'#555' }}>{e.descanso}</td>
                <td style={{ padding:'7px 8px', color:'#555', fontSize:'11px' }}>{e.comoRealizarlo || '-'}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}

      {/* Dieta */}
      {tienePlan && dieta && (
        <div style={{ background:'white', borderRadius:'10px', border:'0.5px solid #dce8f0', padding:'14px', marginBottom:'12px' }}>
          <div style={{ fontWeight:'700', color:'#1a3a5c', fontSize:'14px', marginBottom:'6px' }}>MI PLAN DE DIETA — {dieta.nombre}</div>
          <div style={{ display:'flex', gap:'10px', flexWrap:'wrap', marginBottom:'12px' }}>
            {dieta.caloriasXDia && <span style={{ background:'#eaf3fb', color:'#1a3a5c', padding:'4px 12px', borderRadius:'20px', fontSize:'12px', fontWeight:'600' }}>🔥 {dieta.caloriasXDia} kcal/día</span>}
            {dieta.objetivo && <span style={{ background:'#e6f4ea', color:'#2e7d32', padding:'4px 12px', borderRadius:'20px', fontSize:'12px', fontWeight:'600' }}>🎯 {dieta.objetivo}</span>}
            {dieta.pesoMeta && <span style={{ background:'#fff3e0', color:'#e65100', padding:'4px 12px', borderRadius:'20px', fontSize:'12px', fontWeight:'600' }}>⚖️ Meta: {dieta.pesoMeta} kg</span>}
          </div>
          {dieta.comidas?.map((c,i) => (
            <div key={i} style={{ background:'#f8fbfd', borderRadius:'8px', padding:'10px 12px', marginBottom:'8px', border:'0.5px solid #dce8f0' }}>
              <div style={{ fontWeight:'700', color:'#2e6da4', fontSize:'13px', marginBottom:'4px' }}>🍽️ {c.nombreComida} {c.hora && `(${c.hora})`}</div>
              <div style={{ fontSize:'13px', color:'#444' }}>{c.alimentos}</div>
              {c.calorias && <div style={{ fontSize:'11px', color:'#888', marginTop:'3px' }}>{c.calorias} kcal</div>}
            </div>
          ))}
          {dieta.notasCoach && (
            <div style={{ background:'#fff9c4', borderRadius:'8px', padding:'10px 12px', border:'1px solid #f9a825', marginTop:'8px' }}>
              <strong style={{ fontSize:'12px', color:'#856404' }}>💬 Nota del coach:</strong>
              <p style={{ fontSize:'13px', color:'#555', margin:'4px 0 0' }}>{dieta.notasCoach}</p>
            </div>
          )}
        </div>
      )}

      {/* Pagos */}
      <div style={{ background:'white', borderRadius:'10px', border:'0.5px solid #dce8f0', padding:'14px' }}>
        <div style={{ fontWeight:'700', color:'#1a3a5c', fontSize:'14px', marginBottom:'10px' }}>MIS PAGOS</div>
        {pagos.length === 0 ? <p style={{ color:'#888', fontSize:'13px' }}>Sin pagos registrados</p> : (
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'12px' }}>
            <thead><tr style={{ background:'#1a3a5c' }}>
              {['Concepto','Monto','Método','Estado','Fecha'].map(h => <th key={h} style={{ color:'white', padding:'7px 8px', textAlign:'left' }}>{h}</th>)}
            </tr></thead>
            <tbody>{pagos.map((p,i) => (
              <tr key={p._id} style={{ background: i%2===0?'white':'#f8fbfd' }}>
                <td style={{ padding:'7px 8px', color:'#555' }}>{p.concepto}</td>
                <td style={{ padding:'7px 8px', fontWeight:'700', color:'#2e7d32' }}>${p.monto?.toLocaleString()}</td>
                <td style={{ padding:'7px 8px', color:'#555' }}>{p.metodoPago}</td>
                <td style={{ padding:'7px 8px' }}>
                  <span style={{ background:p.estado==='pagado'?'#e6f4ea':'#fff3e0', color:p.estado==='pagado'?'#2e7d32':'#e65100', padding:'2px 9px', borderRadius:'20px', fontSize:'11px', fontWeight:'600' }}>{p.estado}</span>
                </td>
                <td style={{ padding:'7px 8px', color:'#888', fontSize:'11px' }}>{new Date(p.fechaPago).toLocaleDateString('es-MX')}</td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
    </div>
  )
}
