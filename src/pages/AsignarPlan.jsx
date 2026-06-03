import { useState, useEffect } from 'react'
import axios from 'axios'

export default function AsignarPlan() {
  const [miembros, setMiembros] = useState([])
  const [rutinas, setRutinas] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [seleccionado, setSeleccionado] = useState(null)
  const [form, setForm] = useState({
    peso: '', edad: '', objetivo: '', notasCoach: '',
    rutina_id: '', pagoBiotipo: false
  })
  const [msg, setMsg] = useState('')
  const [msgTipo, setMsgTipo] = useState('')
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    axios.get('/miembros').then(r => setMiembros(r.data)).catch(() => {})
    axios.get('/rutinas').then(r => setRutinas(r.data)).catch(() => {})
  }, [])

  const filtrados = busqueda.trim()
    ? miembros.filter(m =>
        m.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        m.correo.toLowerCase().includes(busqueda.toLowerCase())
      )
    : []

  const seleccionar = (m) => {
    setSeleccionado(m)
    setBusqueda(m.nombre)
    setForm({
      peso: m.peso || '',
      edad: m.edad || '',
      objetivo: m.objetivo || '',
      notasCoach: m.notasCoach || '',
      rutina_id: m.rutina_id?._id || m.rutina_id || '',
      pagoBiotipo: m.pagoBiotipo || false
    })
    setMsg('')
  }

  const guardar = async () => {
    if (!seleccionado) {
      setMsg('Selecciona un miembro primero')
      setMsgTipo('error')
      return
    }
    setGuardando(true)
    setMsg('')
    try {
      const datos = {
        pagoBiotipo: form.pagoBiotipo,
      }
      if (form.peso) datos.peso = Number(form.peso)
      if (form.edad) datos.edad = Number(form.edad)
      if (form.objetivo) datos.objetivo = form.objetivo
      if (form.notasCoach) datos.notasCoach = form.notasCoach
      if (form.rutina_id && form.rutina_id !== '') datos.rutina_id = form.rutina_id

      console.log('Guardando para miembro:', seleccionado._id, datos)

      const res = await axios.put(`/miembros/${seleccionado._id}`, datos)
      console.log('Respuesta:', res.data)

      setMsg('✅ Plan guardado correctamente para ' + seleccionado.nombre)
      setMsgTipo('ok')
      // Actualizar el miembro seleccionado con los nuevos datos
      setSeleccionado(res.data.miembro)
      // Recargar lista de miembros
      axios.get('/miembros').then(r => setMiembros(r.data)).catch(() => {})
    } catch (err) {
      console.error('Error guardando:', err)
      setMsg('❌ Error: ' + (err.response?.data?.error || err.message))
      setMsgTipo('error')
    } finally {
      setGuardando(false)
      setTimeout(() => setMsg(''), 5000)
    }
  }

  const inp = { width:'100%', padding:'8px 10px', border:'1px solid #ccc', borderRadius:'6px', fontSize:'13px', color:'#222', background:'white' }

  return (
    <div style={{ padding:'16px' }}>
      <div style={{ background:'white', borderRadius:'10px', border:'0.5px solid #dce8f0', padding:'16px' }}>
        <div style={{ fontWeight:'700', color:'#1a3a5c', fontSize:'16px', marginBottom:'16px' }}>
          Asignar Plan al Miembro
        </div>

        {/* Searchbar */}
        <div style={{ position:'relative', marginBottom:'16px' }}>
          <label style={{ fontSize:'12px', fontWeight:'600', color:'#555', display:'block', marginBottom:'4px' }}>
            🔍 Buscar miembro
          </label>
          <input
            value={busqueda}
            onChange={e => { setBusqueda(e.target.value); setSeleccionado(null) }}
            placeholder="Escribe el nombre del miembro..."
            style={inp}
          />
          {filtrados.length > 0 && !seleccionado && (
            <div style={{ position:'absolute', top:'100%', left:0, right:0, background:'white',
              border:'1px solid #dce8f0', borderRadius:'6px', zIndex:10, maxHeight:'200px', overflowY:'auto',
              boxShadow:'0 4px 12px rgba(0,0,0,0.1)' }}>
              {filtrados.map(m => (
                <div key={m._id} onClick={() => seleccionar(m)}
                  style={{ padding:'10px 14px', cursor:'pointer', borderBottom:'0.5px solid #eee',
                    display:'flex', justifyContent:'space-between', alignItems:'center' }}
                  onMouseEnter={e => e.currentTarget.style.background='#eaf3fb'}
                  onMouseLeave={e => e.currentTarget.style.background='white'}>
                  <div>
                    <strong style={{ color:'#1a3a5c' }}>{m.nombre}</strong>
                    <span style={{ color:'#888', fontSize:'12px', marginLeft:'8px' }}>{m.correo}</span>
                  </div>
                  <span style={{ background:'#e3f0fb', color:'#0d47a1', padding:'2px 8px',
                    borderRadius:'20px', fontSize:'11px' }}>
                    {m.membresia_id?.nombre || 'Sin membresía'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info del miembro seleccionado */}
        {seleccionado && (
          <div style={{ background:'#eaf3fb', borderRadius:'8px', padding:'12px', marginBottom:'16px',
            border:'1px solid #2e6da4' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <strong style={{ color:'#1a3a5c' }}>{seleccionado.nombre}</strong>
                <span style={{ color:'#555', fontSize:'12px', marginLeft:'8px' }}>{seleccionado.correo}</span>
              </div>
              <button onClick={() => { setSeleccionado(null); setBusqueda('') }}
                style={{ background:'transparent', border:'none', color:'#888', cursor:'pointer', fontSize:'12px' }}>
                Cambiar
              </button>
            </div>
            <div style={{ fontSize:'12px', color:'#555', marginTop:'4px' }}>
              Rutina actual: <strong>{seleccionado.rutina_id?.nombre || 'Sin rutina'}</strong>
              {' | '}Dieta actual: <strong>{seleccionado.dieta_id?.nombre || 'Sin dieta'}</strong>
              {' | '}Plan: <strong>{seleccionado.pagoBiotipo ? '✅ Personalizado' : '⭕ Básico'}</strong>
            </div>
          </div>
        )}

        {/* Formulario */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'12px' }}>
          <div>
            <label style={{ fontSize:'12px', fontWeight:'600', color:'#333', display:'block', marginBottom:'4px' }}>Peso actual (kg)</label>
            <input type="number" value={form.peso} onChange={e => setForm({...form, peso:e.target.value})} placeholder="75" style={inp} />
          </div>
          <div>
            <label style={{ fontSize:'12px', fontWeight:'600', color:'#333', display:'block', marginBottom:'4px' }}>Edad</label>
            <input type="number" value={form.edad} onChange={e => setForm({...form, edad:e.target.value})} placeholder="22" style={inp} />
          </div>
        </div>

        <div style={{ marginBottom:'12px' }}>
          <label style={{ fontSize:'12px', fontWeight:'600', color:'#333', display:'block', marginBottom:'4px' }}>Objetivo</label>
          <select value={form.objetivo} onChange={e => setForm({...form, objetivo:e.target.value})} style={inp}>
            <option value="">-- Seleccionar --</option>
            <option value="Volumen">Volumen</option>
            <option value="Definición">Definición</option>
            <option value="Mantenimiento">Mantenimiento</option>
            <option value="Principiante">Principiante</option>
          </select>
        </div>

        <div style={{ marginBottom:'12px' }}>
          <label style={{ fontSize:'12px', fontWeight:'600', color:'#333', display:'block', marginBottom:'4px' }}>Rutina asignada</label>
          <select value={form.rutina_id} onChange={e => setForm({...form, rutina_id:e.target.value})} style={inp}>
            <option value="">-- Sin rutina --</option>
            {rutinas.map(r => (
              <option key={r._id} value={r._id}>{r.nombre} ({r.nivel})</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom:'12px' }}>
          <label style={{ fontSize:'12px', fontWeight:'600', color:'#333', display:'block', marginBottom:'4px' }}>Notas del coach</label>
          <textarea value={form.notasCoach} onChange={e => setForm({...form, notasCoach:e.target.value})}
            placeholder="Consejos personalizados para el miembro..."
            style={{ ...inp, height:'80px', resize:'vertical' }} />
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'16px',
          background:'#f8fbfd', padding:'10px 14px', borderRadius:'8px', border:'1px solid #dce8f0' }}>
          <input type="checkbox" id="biotipo" checked={form.pagoBiotipo}
            onChange={e => setForm({...form, pagoBiotipo:e.target.checked})}
            style={{ width:'18px', height:'18px', cursor:'pointer' }} />
          <label htmlFor="biotipo" style={{ cursor:'pointer', fontSize:'13px', color:'#333' }}>
            <strong>Pagó consulta personalizada</strong>
            <span style={{ display:'block', fontSize:'11px', color:'#888' }}>
              Activa el acceso a rutina y dieta personalizadas en Mi Panel
            </span>
          </label>
        </div>

        {msg && (
          <div style={{ padding:'10px 14px', borderRadius:'8px', marginBottom:'12px',
            background: msgTipo==='ok' ? '#e6f4ea' : '#fdecea',
            border: `1px solid ${msgTipo==='ok' ? '#2e7d32' : '#c62828'}`,
            color: msgTipo==='ok' ? '#2e7d32' : '#c62828',
            fontWeight:'600', fontSize:'13px' }}>
            {msg}
          </div>
        )}

        <button onClick={guardar} disabled={guardando || !seleccionado}
          style={{ width:'100%', padding:'11px', background: (!seleccionado||guardando) ? '#aaa' : '#2e6da4',
            color:'white', border:'none', borderRadius:'8px', fontSize:'14px', fontWeight:'700',
            cursor: (!seleccionado||guardando) ? 'not-allowed' : 'pointer' }}>
          {guardando ? 'Guardando...' : 'Guardar Plan'}
        </button>
      </div>
    </div>
  )
}
