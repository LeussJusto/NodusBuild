import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../lib/api';

export default function ReportDetail() {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const { data } = await api.get(`/reports/${reportId}`);
      setReport(data);
    } catch (e) {
      setError(e?.response?.data?.message || 'No se pudo cargar el reporte');
    }
  };

  useEffect(() => { load(); }, [reportId]);

  const update = async (payload) => {
    try {
      await api.put(`/reports/${reportId}`, payload);
      await load();
    } catch (e) {
      setError('No se pudo actualizar');
    }
  };

  const approve = async () => {
    try {
      await api.post(`/reports/${reportId}/approve`);
      await load();
    } catch (e) {
      setError('No se pudo aprobar');
    }
  };

  const remove = async () => {
    try {
      await api.delete(`/reports/${reportId}`);
      navigate(-1);
    } catch (e) {
      setError('No se pudo eliminar');
    }
  };

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!report) return <p>Cargando...</p>;

  return (
    <div>
      <h2>Reporte {report.type}</h2>
      <p>Estado: {report.status}</p>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => update({ status: 'in_review' })}>Enviar a revisión</button>
        <button onClick={approve}>Aprobar (residente)</button>
        <button onClick={remove}>Eliminar</button>
      </div>
      <pre style={{ background: '#111', color: '#0f0', padding: 12, overflow: 'auto' }}>
        {report.content}
      </pre>
    </div>
  );
}
