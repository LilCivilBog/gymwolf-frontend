import { useEffect, useState } from 'react'
import axios from 'axios'

const comidaVacia = () => ({ nombreComida: '', alimentos: '', calorias: '', hora: '' })
const formVacio   = () => ({
  nombre: '', objetivo: '', caloriasXDia: '', pesoActual: '',
  pesoMeta: '', edad: '', notasCoach: '', comidas: [comidaVacia()],
})

export default function Dietas() {
  const [miembros, setMiembros]         = useState([])
  const [busqueda, setBusqueda]         = useState('')
  const [seleccionado, setSeleccionado] = useState(null)
  const [form, setForm]                 = useState(formVacio())
  const [pagoBiotipo, setPagoBiotipo]   = useState(false)
  const [msg, setMsg]                   = useState('')
  const [msgTipo, setMsgTipo]           = useState('')
  const [guardando, setGuardando]       = useState(false)

  useEffect(() => {
    axios.get('/miembros').then(r => setMiembros(r.data)).catch(() => {})
  }, [])

  const miembrosFiltrados = busqueda && !seleccionado
    ? miembros.filter(m => m.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    : []

  const seleccionar = async (m) => {
    setSeleccionado(m)
    setBusqueda(m.nombre)
    setPagoBiotipo(m.pagoBiotipo || false)

    const dietaId = m.dieta_id?._id || m.dieta_id
    if (dietaId) {
      try {
        const res = await axios.get(`/dietas/${dietaId}`)
        const d = res.data
        setForm({
          nombre:       d.nombre       || '',
          objetivo:     d.objetivo     || '',
          caloriasXDia: d.caloriasXDia || '',
          pesoActual:   d.pesoActual   || '',
          pesoMeta:     d.pesoMeta     || '',
          edad:         d.edad         || '',
          notasCoach:   d.notasCoach   || '',
          comidas:      d.comidas?.length ? d.comidas : [comidaVacia()],
        })
      } catch {
        setForm({ ...formVacio(), pesoActual: m.peso || '', edad: m.edad || '' })
      }
    } else {
      setForm({ ...formVacio(), pesoActual: m.peso || '', edad: m.edad || '' })
    }
  }

  const guardar = async () => {
    if (!seleccionado) { setMsg('Selecciona un miembro'); setMsgTipo('error'); return }
    if (!form.nombre) { setMsg('El nombre del plan es obligatorio'); setMsgTipo('error'); return }
    setGuardando(true); setMsg('')
    try {
      const dietaData = {
        nombre: form.nombre,
        objetivo: form.objetivo || 'Personalizado',
        caloriasXDia: form.caloriasXDia ? Number(form.caloriasXDia) : undefined,
        pesoActual: form.pesoActual ? Number(form.pesoActual) : undefined,
        pesoMeta: form.pesoMeta ? Number(form.pesoMeta) : undefined,
        notasCoach: form.notasCoach || '',
        comidas: form.comidas || [],
      }
      // Limpiar undefined
      Object.keys(dietaData).forEach(k => dietaData[k] === undefined && delete dietaData[k])

      let dietaId = seleccionado.dieta_id?._id || seleccionado.dieta_id

      if (dietaId) {
        await axios.put(`/dietas/${dietaId}`, dietaData)
      } else {
        const res = await axios.post('/dietas', dietaData)
        dietaId = res.data.id || res.data.dieta?._id || res.data._id
      }

      // Actualizar miembro con la dieta y pagoBiotipo
      const miembroData = { pagoBiotipo: pagoBiotipo }
      if (dietaId) miembroData.dieta_id = dietaId
      if (form.pesoActual) miembroData.peso = Number(form.pesoActual)

      await axios.put(`/miembros/${seleccionado._id}`, miembroData)

      setMsg('✅ Dieta guardada correctamente para ' + seleccionado.nombre)
      setMsgTipo('ok')
      // Recargar miembros
      const r = await axios.get('/miembros')
      setMiembros(r.data)
      setTimeout(() => setMsg(''), 5000)
    } catch (err) {
      console.error('Error guardando dieta:', err)
      setMsg('❌ Error: ' + (err.response?.data?.error || err.message))
      setMsgTipo('error')
    } finally {
      setGuardando(false)
    }
  }

  const updateComida = (i, campo, valor) => {
    const comidas = [...form.comidas]
    comidas[i] = { ...comidas[i], [campo]: valor }
    setForm({ ...form, comidas })
  }

  const addComida    = () => setForm({ ...form, comidas: [...form.comidas, comidaVacia()] })
  const removeComida = (i) => {
    if (form.comidas.length === 1) return
    setForm({ ...form, comidas: form.comidas.filter((_, idx) => idx !== i) })
  }

  const inp = {
    width: '100%', padding: '7px 10px', border: '1px solid #ccc',
    borderRadius: '6px', fontSize: '13px', color: '#222',
    marginBottom: '8px', boxSizing: 'border-box',
  }

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ background: 'white', borderRadius: '10px', border: '0.5px solid #dce8f0', padding: '14px' }}>
        <div style={{ fontWeight: '700', color: '#1a3a5c', fontSize: '15px', marginBottom: '14px' }}>
          Dietas y Nutrición
        </div>

        {/* Searchbar */}
        <div style={{ position: 'relative', marginBottom: '8px' }}>
          <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)',
            fontSize: '14px', color: '#888' }}>🔍</span>
          <input
            type="text"
            placeholder="Buscar miembro por nombre..."
            value={busqueda}
            onChange={e => { setBusqueda(e.target.value); setSeleccionado(null) }}
            style={{ ...inp, paddingLeft: '34px', marginBottom: '0' }}
          />
        </div>

        {/* Resultados de búsqueda */}
        {miembrosFiltrados.length > 0 && (
          <div style={{ border: '1px solid #dce8f0', borderRadius: '8px', overflow: 'hidden',
            marginBottom: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            {miembrosFiltrados.map(m => (
              <div key={m._id}
                onClick={() => seleccionar(m)}
                style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: '0.5px solid #eee',
                  display: 'flex', alignItems: 'center', gap: '10px', background: 'white' }}
                onMouseOver={e => e.currentTarget.style.background = '#f0f7ff'}
                onMouseOut={e => e.currentTarget.style.background = 'white'}
              >
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#1a3a5c',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: '700', fontSize: '13px', flexShrink: 0 }}>
                  {m.nombre.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: '#1a3a5c', fontSize: '13px' }}>{m.nombre}</div>
                  <div style={{ color: '#888', fontSize: '11px' }}>
                    {m.membresia_id?.nombre || 'Sin membresía'} · {m.estado ? 'Activo' : 'Inactivo'}
                    {(m.dieta_id?._id || m.dieta_id) && (
                      <span style={{ color: '#2e7d32', marginLeft: '6px' }}>· Tiene dieta ✓</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Miembro seleccionado + formulario */}
        {seleccionado && (
          <>
            {/* Cabecera del miembro */}
            <div style={{ background: '#f0f7ff', borderRadius: '8px', padding: '10px 14px',
              marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontWeight: '700', color: '#1a3a5c', fontSize: '14px' }}>{seleccionado.nombre}</span>
                <span style={{ margin: '0 8px', color: '#aaa' }}>|</span>
                <span style={{ color: '#555', fontSize: '12px' }}>Correo: {seleccionado.correo}</span>
                <span style={{ margin: '0 8px', color: '#aaa' }}>|</span>
                <span style={{ color: '#555', fontSize: '12px' }}>
                  Membresía: {seleccionado.membresia_id?.nombre || 'Sin membresía'}
                </span>
              </div>
              <button
                onClick={() => { setSeleccionado(null); setBusqueda('') }}
                style={{ background: 'transparent', border: '1px solid #ccc', padding: '4px 10px',
                  borderRadius: '6px', cursor: 'pointer', fontSize: '11px', color: '#555' }}>
                Cambiar
              </button>
            </div>

            {/* Título sección */}
            <div style={{ fontWeight: '700', color: '#1a3a5c', fontSize: '13px', marginBottom: '10px',
              background: '#f8fbfd', padding: '8px 12px', borderRadius: '8px', border: '1px solid #dce8f0' }}>
              PLAN DE DIETA PERSONALIZADA
            </div>

            {/* Nombre del plan */}
            <div>
              <label style={{ fontSize: '11px', fontWeight: '600', color: '#333', display: 'block', marginBottom: '3px' }}>
                Nombre del plan *
              </label>
              <input type="text" placeholder="Plan de volumen personalizado" value={form.nombre}
                onChange={e => setForm({ ...form, nombre: e.target.value })} style={inp} />
            </div>

            {/* Objetivo y calorías */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '600', color: '#333', display: 'block', marginBottom: '3px' }}>Objetivo</label>
                <select value={form.objetivo} onChange={e => setForm({ ...form, objetivo: e.target.value })} style={inp}>
                  <option value="">-- Seleccionar --</option>
                  <option value="Volumen">Volumen</option>
                  <option value="Definición">Definición</option>
                  <option value="Mantenimiento">Mantenimiento</option>
                  <option value="Personalizado">Personalizado</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '600', color: '#333', display: 'block', marginBottom: '3px' }}>Calorías por día</label>
                <input type="number" placeholder="2200" value={form.caloriasXDia}
                  onChange={e => setForm({ ...form, caloriasXDia: e.target.value })} style={inp} />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '600', color: '#333', display: 'block', marginBottom: '3px' }}>Peso actual (kg)</label>
                <input type="number" placeholder="70" value={form.pesoActual}
                  onChange={e => setForm({ ...form, pesoActual: e.target.value })} style={inp} />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '600', color: '#333', display: 'block', marginBottom: '3px' }}>Peso meta (kg)</label>
                <input type="number" placeholder="80" value={form.pesoMeta}
                  onChange={e => setForm({ ...form, pesoMeta: e.target.value })} style={inp} />
              </div>
            </div>

            {/* Plan de comidas */}
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#1a3a5c' }}>PLAN DE COMIDAS</span>
                <button onClick={addComida}
                  style={{ background: '#2e6da4', color: 'white', border: 'none', padding: '4px 10px',
                    borderRadius: '5px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}>
                  + Agregar comida
                </button>
              </div>

              {form.comidas.map((c, i) => (
                <div key={i} style={{ border: '1px solid #dce8f0', borderRadius: '8px',
                  padding: '10px', marginBottom: '8px', background: '#f8fbfd' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#2e6da4' }}>Comida {i + 1}</span>
                    {form.comidas.length > 1 && (
                      <button onClick={() => removeComida(i)}
                        style={{ background: '#fdecea', border: '1px solid #ef9a9a', color: '#c62828',
                          cursor: 'pointer', fontSize: '11px', padding: '2px 8px', borderRadius: '4px' }}>
                        ❌ Eliminar
                      </button>
                    )}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                    <div>
                      <label style={{ fontSize: '10px', color: '#666', display: 'block', marginBottom: '2px' }}>Nombre (ej: Desayuno)</label>
                      <input type="text" placeholder="Desayuno" value={c.nombreComida}
                        onChange={e => updateComida(i, 'nombreComida', e.target.value)}
                        style={{ ...inp, marginBottom: '0' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '10px', color: '#666', display: 'block', marginBottom: '2px' }}>Hora</label>
                      <input type="text" placeholder="7:00 AM" value={c.hora}
                        onChange={e => updateComida(i, 'hora', e.target.value)}
                        style={{ ...inp, marginBottom: '0' }} />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ fontSize: '10px', color: '#666', display: 'block', marginBottom: '2px' }}>Alimentos</label>
                      <input type="text" placeholder="Avena, leche, fruta, huevos..." value={c.alimentos}
                        onChange={e => updateComida(i, 'alimentos', e.target.value)}
                        style={{ ...inp, marginBottom: '0' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '10px', color: '#666', display: 'block', marginBottom: '2px' }}>Calorías</label>
                      <input type="number" placeholder="450" value={c.calorias}
                        onChange={e => updateComida(i, 'calorias', e.target.value)}
                        style={{ ...inp, marginBottom: '0' }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Notas del coach */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '11px', fontWeight: '600', color: '#333', display: 'block', marginBottom: '3px' }}>
                Notas del coach
              </label>
              <textarea rows={2} placeholder="Consejos nutricionales personalizados..." value={form.notasCoach}
                onChange={e => setForm({ ...form, notasCoach: e.target.value })}
                style={{ ...inp, resize: 'vertical', marginBottom: '0' }} />
            </div>

            {/* Toggle pagoBiotipo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px',
              background: '#f8fbfd', padding: '12px 14px', borderRadius: '8px', border: '1px solid #dce8f0' }}>
              <div
                style={{ position: 'relative', width: '44px', height: '24px', cursor: 'pointer', flexShrink: 0 }}
                onClick={() => setPagoBiotipo(!pagoBiotipo)}
              >
                <div style={{ width: '44px', height: '24px', borderRadius: '12px',
                  background: pagoBiotipo ? '#2e7d32' : '#ccc', transition: 'background 0.2s' }} />
                <div style={{ position: 'absolute', top: '2px',
                  left: pagoBiotipo ? '22px' : '2px', width: '20px', height: '20px',
                  borderRadius: '50%', background: 'white',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.3)', transition: 'left 0.2s' }} />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#1a3a5c' }}>
                  {pagoBiotipo ? '✅ Dieta personalizada activada' : '☐ Dieta personalizada inactiva'}
                </div>
                <div style={{ fontSize: '11px', color: '#888' }}>
                  Activa el acceso al plan de dieta en Mi Panel del miembro
                </div>
              </div>
            </div>

            {msg && (
              <div style={{ marginBottom: '10px', fontSize: '13px',
                color: msg.includes('✅') ? '#2e7d32' : '#c62828' }}>{msg}</div>
            )}

            <button onClick={guardar}
              style={{ width: '100%', background: '#2e6da4', color: 'white', border: 'none',
                padding: '10px', borderRadius: '8px', cursor: 'pointer',
                fontSize: '14px', fontWeight: '700', letterSpacing: '0.5px' }}>
              Guardar Dieta
            </button>
          </>
        )}
      </div>
    </div>
  )
}
