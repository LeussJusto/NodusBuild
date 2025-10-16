import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../lib/api';

export default function ActivityLogs() {
  const { id } = useParams(); // projectId
  const [week, setWeek] = useState('');
  const [year, setYear] = useState('');
  const [logs, setLogs] = useState([]);
  const [ppc, setPpc] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const params = {};
      if (week) params.week = week;
      if (year) params.year = year;
      const { data } = await api.get(`/projects/${id}/activity-logs`, { params });
      setLogs(data);
      if (week && year) {
        const { data: p } = await api.get(`/projects/${id}/ppc`, { params });
        setPpc(p);
      } else {
        setPpc(null);
      }
    } catch (e) {
      setError(e?.response?.data?.message || 'No se pudo cargar actividad');
    }
  };

  useEffect(() => { load(); }, [id]);

  return (
    <div>
      <h2>Actividad y PPC</h2>
      <div style={{ display: 'flex', gap: 8 }}>
        <input placeholder="Semana" value={week} onChange={(e) => setWeek(e.target.value)} />
        <input placeholder="Año" value={year} onChange={(e) => setYear(e.target.value)} />
        <button onClick={load}>Filtrar</button>
      </div>
      {ppc && (
        <p>PPC: {ppc.ppc}% ({ppc.completed}/{ppc.total})</p>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {logs.map(l => (
          <li key={l._id}>
            Semana {l.week} - {l.year} — {l.entries?.length} actividades
          </li>
        ))}
      </ul>
    </div>
  );
}
