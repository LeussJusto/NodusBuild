import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../lib/api';

export default function ProjectTasks() {
  const { id } = useParams(); // projectId
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/projects/${id}/tasks`);
      setTasks(data);
    } catch (e) {
      setError(e?.response?.data?.message || 'No se pudieron cargar tareas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  if (loading) return <p>Cargando tareas...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h3>Tareas</h3>
        <Link to={`/projects/${id}/tasks/new`}>Nueva tarea</Link>
      </div>
      <ul>
        {tasks.map(t => (
          <li key={t._id}>
            <Link to={`/tasks/${t._id}`}>{t.title}</Link> — {t.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
