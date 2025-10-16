import React, { useEffect, useState } from 'react';
import api from '../../lib/api';

export default function DocumentsList() {
  const [docs, setDocs] = useState([]);
  const [projectId, setProjectId] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const params = projectId ? { projectId } : undefined;
      const { data } = await api.get('/documents', { params });
      setDocs(data);
    } catch (e) {
      setError(e?.response?.data?.message || 'No se pudieron cargar documentos');
    }
  };

  useEffect(() => { load(); }, []);

  const approve = async (id) => {
    try {
      await api.post(`/documents/${id}/approve`);
      await load();
    } catch (e) {
      setError('No se pudo aprobar');
    }
  };

  const download = (id) => {
    window.location.href = `/api/documents/download/${id}`;
  };

  const remove = async (id) => {
    try {
      await api.delete(`/documents/${id}`);
      await load();
    } catch (e) {
      setError('No se pudo eliminar');
    }
  };

  return (
    <div>
      <h2>Documentos</h2>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input placeholder="Filtrar por proyectoId" value={projectId} onChange={(e) => setProjectId(e.target.value)} />
        <button onClick={load}>Buscar</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {docs.map(d => (
          <li key={d._id}>
            {d.originalName || d.filename} — {d.category} — {d.status}
            <button onClick={() => download(d._id)} style={{ marginLeft: 8 }}>Descargar</button>
            <button onClick={() => approve(d._id)} style={{ marginLeft: 8 }}>Aprobar</button>
            <button onClick={() => remove(d._id)} style={{ marginLeft: 8 }}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
