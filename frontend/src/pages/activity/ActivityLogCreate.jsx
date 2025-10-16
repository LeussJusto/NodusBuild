import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../lib/api';

export default function ActivityLogCreate() {
  const { id } = useParams();
  const [form, setForm] = useState({ week: '', year: '', entries: [] });
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/projects/${id}/tasks`);
        setTasks(data);
      } catch (e) {
        setError('No se pudieron cargar tareas');
      }
    })();
  }, [id]);

  const addEntry = () => {
    setForm({ ...form, entries: [...form.entries, { task: '', planned: false, completed: false }] });
  };

  const updateEntry = (idx, patch) => {
    const entries = form.entries.slice();
    entries[idx] = { ...entries[idx], ...patch };
    setForm({ ...form, entries });
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/projects/${id}/activity-logs`, { ...form, week: Number(form.week), year: Number(form.year) });
      setMessage('Creado');
      setError('');
    } catch (e) {
      setMessage('');
      setError(e?.response?.data?.message || 'No se pudo crear');
    }
  };

  return (
    <div>
      <h3>Nuevo Activity Log</h3>
      <form onSubmit={submit}>
        <div>
          <label>Semana</label>
          <input value={form.week} onChange={(e) => setForm({ ...form, week: e.target.value })} required />
        </div>
        <div>
          <label>Año</label>
          <input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} required />
        </div>
        <div>
          <button type="button" onClick={addEntry}>Agregar actividad</button>
        </div>
        {form.entries.map((en, idx) => (
          <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
            <select value={en.task} onChange={(e) => updateEntry(idx, { task: e.target.value })}>
              <option value="">Tarea</option>
              {tasks.map(t => <option key={t._id} value={t._id}>{t.title}</option>)}
            </select>
            <label><input type="checkbox" checked={en.planned} onChange={(e) => updateEntry(idx, { planned: e.target.checked })} /> Planificada</label>
            <label><input type="checkbox" checked={en.completed} onChange={(e) => updateEntry(idx, { completed: e.target.checked })} /> Completada</label>
          </div>
        ))}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {message && <p style={{ color: 'green' }}>{message}</p>}
        <button type="submit">Crear</button>
      </form>
    </div>
  );
}
