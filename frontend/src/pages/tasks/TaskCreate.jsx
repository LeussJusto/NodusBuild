import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../lib/api';

export default function TaskCreate() {
  const { id } = useParams(); // projectId
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    assignedTo: '',
    plannedDate: '',
    priority: 'medium',
    estimatedHours: 0,
    dependencies: [],
    ppcWeek: undefined,
    checklist: []
  });
  const [project, setProject] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/projects/${id}`);
        setProject(data);
      } catch (e) {
        setError('No se pudo cargar proyecto');
      }
    })();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, plannedDate: new Date(form.plannedDate).toISOString() };
      const { data } = await api.post(`/projects/${id}/tasks`, payload);
      navigate(`/tasks/${data._id}`);
    } catch (e) {
      setError(e?.response?.data?.message || 'No se pudo crear la tarea');
    }
  };

  return (
    <div style={{ maxWidth: 560 }}>
      <h2>Nueva tarea</h2>
      {project && <p>Proyecto: {project.name}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Título</label>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        </div>
        <div>
          <label>Descripción</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div>
          <label>Asignado a</label>
          <select value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })} required>
            <option value="">Seleccione</option>
            {project?.owner && <option value={project.owner._id || project.owner}>Owner</option>}
            {project?.team?.map(tm => (
              <option key={tm.user?._id || tm.user} value={tm.user?._id || tm.user}>
                {tm.user?.email || tm.user} ({tm.role})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Fecha planificada</label>
          <input type="date" value={form.plannedDate} onChange={(e) => setForm({ ...form, plannedDate: e.target.value })} required />
        </div>
        <div>
          <label>Prioridad</label>
          <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
            <option value="low">Baja</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
            <option value="critical">Crítica</option>
          </select>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Crear</button>
      </form>
    </div>
  );
}
