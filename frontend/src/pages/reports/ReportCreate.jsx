import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../lib/api';

export default function ReportCreate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ type: 'weekly', content: '', status: 'draft', relatedTasks: [], checklist: [] });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post(`/projects/${id}/reports`, form);
      navigate(`/reports/${data._id}`);
    } catch (e) {
      setError(e?.response?.data?.message || 'No se pudo crear el reporte');
    }
  };

  return (
    <div style={{ maxWidth: 560 }}>
      <h2>Nuevo reporte</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tipo</label>
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="daily">Diario</option>
            <option value="weekly">Semanal</option>
            <option value="monthly">Mensual</option>
          </select>
        </div>
        <div>
          <label>Contenido</label>
          <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Crear</button>
      </form>
    </div>
  );
}
