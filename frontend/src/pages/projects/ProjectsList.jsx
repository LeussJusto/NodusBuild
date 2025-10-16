import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';

export default function ProjectsList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/projects');
        if (mounted) setProjects(data);
      } catch (e) {
        setError(e?.response?.data?.message || 'No se pudo cargar proyectos');
      } finally {
        setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  if (loading) return <p>Cargando proyectos...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Proyectos</h2>
        <Link to="/projects/new">Nuevo proyecto</Link>
      </div>
      <ul>
        {projects.map((p) => (
          <li key={p._id}>
            <Link to={`/projects/${p._id}`}>{p.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
