import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../lib/api';

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/projects/${id}`);
        setProject(data);
      } catch (e) {
        setError(e?.response?.data?.message || 'No se pudo cargar el proyecto');
      }
    })();
  }, [id]);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!project) return <p>Cargando...</p>;

  return (
    <div>
      <h2>{project.name}</h2>
      <p>{project.description}</p>
      <h3>Equipo</h3>
      <ul>
        {project.team?.map((m) => (
          <li key={m.user?._id || m.user}>
            {m.user?.email || m.user} — {m.role}
          </li>
        ))}
      </ul>
    </div>
  );
}
