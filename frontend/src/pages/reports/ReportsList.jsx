import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../lib/api';

export default function ReportsList() {
  const { id } = useParams(); // projectId
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/projects/${id}/reports`);
      setReports(data);
    } catch (e) {
      setError(e?.response?.data?.message || 'No se pudieron cargar reportes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  if (loading) return <p>Cargando reportes...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h3>Reportes</h3>
        <Link to={`/projects/${id}/reports/new`}>Nuevo reporte</Link>
      </div>
      <ul>
        {reports.map(r => (
          <li key={r._id}>
            <Link to={`/reports/${r._id}`}>{r.type} — {new Date(r.date).toLocaleDateString()}</Link> — {r.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
