import { useEffect, useState } from 'react'
import axios from 'axios'

const ejercicioVacio = () => ({ nombre: '', series: '', repeticiones: '', descanso: '', comoRealizarlo: '' })
const formVacio = () => ({
  nombre: '', nivel: 'principiante', objetivo: 'Volumen',
  tipoEntrenamiento: '', descripcion: '', costoExtra: '0',
  duracionSemanas: '', notasCoach: '',
  ejercicios: [ejercicioVacio()],
})

export default function Rutinas() {
  const [lista, setLista]   = useState([])
  const [filtro, setFiltro] = useState('todos')
  const [modal, setModal]   = useState(false)
  const [form, setForm]     = useState(formVacio())
  const [msg, setMsg]       = useState('')

  const cargar = () => axios.get('/rutinas').then(r => setLista(r.data)).catch(() => {})
  useEffect(() => { cargar() }, [])

  const eliminar = async (id) => {
    if (!confirm('¿Eliminar esta rutina?')) return
    await axios.delete(`/rutinas/${id}`)
    cargar()
  }

  const guardar = async () => {
    if (!form.nombre || !form.duracionSemanas) {
      setMsg('❌ Nombre y duración en semanas son obligatorios')
      return
    }
    try {
      await axios.post('/rutinas', form)
      setModal(false)
      setForm(formVacio())
      setMsg('✅ Rutina creada correctamente')
      cargar()
      setTimeout(() => setMsg(''), 3000)
    } catch (err) {
      setMsg('❌ ' + (err.response?.data?.error || 'Error al guardar'))
    }
  }

  const updateEjercicio = (i, campo, valor) => {
    const ejercicios = [...form.ejercicios]
    ejercicios[i] = { ...ejercicios[i], [campo]: valor }
    setForm({ ...form, ejercicios })
  }

  const addEjercicio    = () => setForm({ ...form, ejercicios: [...form.ejercicios, ejercicioVacio()] })
  const removeEjercicio = (i) => {
    if (form.ejercicios.length === 1) return
    setForm({ ...form, ejercicios: form.ejercicios.filter((_, idx) => idx !== i) })
  }

  const filtradas = filtro === 'todos' ? lista : lista.filter(r => r.objetivo === filtro)
  const colores   = { principiante: '#2e7d32', intermedio: '#1565c0', avanzado: '#c62828' }

  const inp = {
    width: '100%', padding: '7px 10px', border: '1px solid #ccc',
    borderRadius: '6px', fontSize: '13px', color: '#222',
    marginBottom: '8px', boxSizing: 'border-box',
  }

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ background: 'white', borderRadius: '10px', border: '0.5px solid #dce8f0', padding: '14px' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontWeight: '700', color: '#1a3a5c', fontSize: '15px' }}>Rutinas de Entrenamiento</span>
          <button
            onClick={() => { setForm(formVacio()); setMsg(''); setModal(true) }}
            style={{ background: '#2e7d32', color: 'white', border: 'none', padding: '6px 14px',
              borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }}>
            + Nueva Rutina
          </button>
        </div>

        {msg && (
          <div style={{ marginBottom: '10px', fontSize: '13px',
            color: msg.includes('✅') ? '#2e7d32' : '#c62828' }}>{msg}</div>
        )}

        {/* Filtros */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
          {['todos', 'Volumen', 'Definición', 'Principiante'].map(f => (
            <button key={f} onClick={() => setFiltro(f)}
              style={{ padding: '5px 14px', borderRadius: '20px', border: '1px solid #cdd5dd',
                background: filtro === f ? '#1a3a5c' : 'white',
                color: filtro === f ? 'white' : '#333',
                cursor: 'pointer', fontSize: '12px', fontWeight: '500' }}>
              {f === 'todos' ? 'Todas' : f}
            </button>
          ))}
        </div>

        {filtradas.length === 0 && (
          <p style={{ color: '#888', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
            No hay rutinas registradas. Agrega una con "+ Nueva Rutina".
          </p>
        )}

        {/* Lista de rutinas */}
        {filtradas.map(r => (
          <div key={r._id} style={{ background: '#f8fbfd', borderRadius: '8px',
            border: '1px solid #dce8f0', padding: '12px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px' }}>
                <strong style={{ color: '#1a3a5c', fontSize: '14px' }}>{r.nombre}</strong>
                <span style={{ background: `${colores[r.nivel] || '#888'}18`, color: colores[r.nivel] || '#888',
                  border: `1px solid ${colores[r.nivel] || '#888'}40`, padding: '2px 9px',
                  borderRadius: '20px', fontSize: '11px', fontWeight: '600' }}>
                  {r.nivel}
                </span>
                <span style={{ background: '#eee', color: '#333', padding: '2px 9px',
                  borderRadius: '20px', fontSize: '11px' }}>
                  {r.objetivo}
                </span>
                {r.tipoEntrenamiento && (
                  <span style={{ background: '#e3f0fb', color: '#0d47a1', padding: '2px 9px',
                    borderRadius: '20px', fontSize: '11px' }}>
                    {r.tipoEntrenamiento}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: colores[r.nivel] || '#555' }}>
                  {r.costoExtra > 0 ? `$${r.costoExtra} MXN extra` : 'Incluida'}
                </span>
                <button onClick={() => eliminar(r._id)}
                  style={{ background: '#c62828', color: 'white', border: 'none', padding: '3px 9px',
                    borderRadius: '5px', cursor: 'pointer', fontSize: '11px' }}>
                  Eliminar
                </button>
              </div>
            </div>
            <p style={{ fontSize: '12px', color: '#555', marginBottom: '8px' }}>{r.descripcion}</p>
            <div style={{ fontSize: '11px', color: '#888' }}>{r.duracionSemanas} semanas</div>
            {r.ejercicios?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px' }}>
                {r.ejercicios.map((e, i) => (
                  <span key={i} style={{ background: '#dde4ec', border: '1px solid #b8c8d8',
                    padding: '3px 10px', borderRadius: '20px', fontSize: '12px', color: '#1a3a5c' }}>
                    <strong>{e.nombre}</strong>{e.series ? ` · ${e.series}` : ''}
                  </span>
                ))}
              </div>
            )}
            {r.notasCoach && (
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#555',
                background: '#fffde7', padding: '6px 10px', borderRadius: '6px', borderLeft: '3px solid #f9a825' }}>
                <strong>Nota del coach:</strong> {r.notasCoach}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal nueva rutina */}
      {modal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 10 }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px',
            width: '620px', maxHeight: '90vh', overflowY: 'auto' }}>

            <div style={{ fontWeight: '700', color: '#1a3a5c', fontSize: '15px',
              borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '14px' }}>
              Nueva Rutina
            </div>

            {/* Nombre */}
            <div>
              <label style={{ fontSize: '11px', fontWeight: '600', color: '#333', display: 'block', marginBottom: '3px' }}>Nombre de la rutina *</label>
              <input type="text" placeholder="Rutina de hipertrofia avanzada" value={form.nombre}
                onChange={e => setForm({ ...form, nombre: e.target.value })} style={inp} />
            </div>

            {/* Nivel, Objetivo, Tipo */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '600', color: '#333', display: 'block', marginBottom: '3px' }}>Nivel</label>
                <select value={form.nivel} onChange={e => setForm({ ...form, nivel: e.target.value })} style={inp}>
                  <option value="principiante">Principiante</option>
                  <option value="intermedio">Intermedio</option>
                  <option value="avanzado">Avanzado</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '600', color: '#333', display: 'block', marginBottom: '3px' }}>Objetivo</label>
                <select value={form.objetivo} onChange={e => setForm({ ...form, objetivo: e.target.value })} style={inp}>
                  <option value="Volumen">Volumen</option>
                  <option value="Definición">Definición</option>
                  <option value="Principiante">Principiante</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '600', color: '#333', display: 'block', marginBottom: '3px' }}>Tipo de entrenamiento</label>
                <select value={form.tipoEntrenamiento} onChange={e => setForm({ ...form, tipoEntrenamiento: e.target.value })} style={inp}>
                  <option value="">-- Seleccionar --</option>
                  <option value="Hipertrofia">Hipertrofia</option>
                  <option value="Fuerza">Fuerza</option>
                  <option value="Resistencia">Resistencia</option>
                  <option value="Pérdida de peso">Pérdida de peso</option>
                  <option value="Mantenimiento">Mantenimiento</option>
                </select>
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label style={{ fontSize: '11px', fontWeight: '600', color: '#333', display: 'block', marginBottom: '3px' }}>Descripción</label>
              <textarea rows={2} placeholder="Descripción general de la rutina..." value={form.descripcion}
                onChange={e => setForm({ ...form, descripcion: e.target.value })}
                style={{ ...inp, resize: 'vertical' }} />
            </div>

            {/* Costo y Duración */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '600', color: '#333', display: 'block', marginBottom: '3px' }}>Costo extra (MXN)</label>
                <input type="number" placeholder="0" value={form.costoExtra}
                  onChange={e => setForm({ ...form, costoExtra: e.target.value })} style={inp} />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '600', color: '#333', display: 'block', marginBottom: '3px' }}>Duración en semanas *</label>
                <input type="number" placeholder="8" value={form.duracionSemanas}
                  onChange={e => setForm({ ...form, duracionSemanas: e.target.value })} style={inp} />
              </div>
            </div>

            {/* Ejercicios */}
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#1a3a5c' }}>Ejercicios</span>
                <button onClick={addEjercicio}
                  style={{ background: '#2e6da4', color: 'white', border: 'none', padding: '3px 10px',
                    borderRadius: '5px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}>
                  + Agregar ejercicio
                </button>
              </div>

              {form.ejercicios.map((ej, i) => (
                <div key={i} style={{ border: '1px solid #dce8f0', borderRadius: '8px',
                  padding: '10px', marginBottom: '8px', background: '#f8fbfd' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#2e6da4' }}>Ejercicio {i + 1}</span>
                    {form.ejercicios.length > 1 && (
                      <button onClick={() => removeEjercicio(i)}
                        style={{ background: 'transparent', border: 'none', color: '#c62828',
                          cursor: 'pointer', fontSize: '16px', padding: '0', lineHeight: 1 }}>×</button>
                    )}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '6px' }}>
                    <div>
                      <label style={{ fontSize: '10px', color: '#666', display: 'block', marginBottom: '2px' }}>Nombre del ejercicio</label>
                      <input type="text" placeholder="Press de banca" value={ej.nombre}
                        onChange={e => updateEjercicio(i, 'nombre', e.target.value)}
                        style={{ ...inp, marginBottom: '0' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '10px', color: '#666', display: 'block', marginBottom: '2px' }}>Series</label>
                      <input type="text" placeholder="4" value={ej.series}
                        onChange={e => updateEjercicio(i, 'series', e.target.value)}
                        style={{ ...inp, marginBottom: '0' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '10px', color: '#666', display: 'block', marginBottom: '2px' }}>Repeticiones</label>
                      <input type="text" placeholder="8-12" value={ej.repeticiones}
                        onChange={e => updateEjercicio(i, 'repeticiones', e.target.value)}
                        style={{ ...inp, marginBottom: '0' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '10px', color: '#666', display: 'block', marginBottom: '2px' }}>Descanso</label>
                      <input type="text" placeholder="90 seg" value={ej.descanso}
                        onChange={e => updateEjercicio(i, 'descanso', e.target.value)}
                        style={{ ...inp, marginBottom: '0' }} />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ fontSize: '10px', color: '#666', display: 'block', marginBottom: '2px' }}>Cómo realizarlo</label>
                      <textarea rows={2} placeholder="Instrucciones de ejecución del ejercicio..."
                        value={ej.comoRealizarlo}
                        onChange={e => updateEjercicio(i, 'comoRealizarlo', e.target.value)}
                        style={{ ...inp, resize: 'vertical', marginBottom: '0' }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Notas del coach */}
            <div>
              <label style={{ fontSize: '11px', fontWeight: '600', color: '#333', display: 'block', marginBottom: '3px' }}>Notas del coach</label>
              <textarea rows={2} placeholder="Indicaciones generales para el alumno..."
                value={form.notasCoach}
                onChange={e => setForm({ ...form, notasCoach: e.target.value })}
                style={{ ...inp, resize: 'vertical' }} />
            </div>

            {msg && (
              <div style={{ color: msg.includes('✅') ? '#2e7d32' : '#c62828',
                fontSize: '12px', marginBottom: '8px' }}>{msg}</div>
            )}

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button onClick={() => setModal(false)}
                style={{ background: '#888', color: 'white', border: 'none', padding: '6px 14px',
                  borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
                Cancelar
              </button>
              <button onClick={guardar}
                style={{ background: '#2e6da4', color: 'white', border: 'none', padding: '6px 14px',
                  borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
