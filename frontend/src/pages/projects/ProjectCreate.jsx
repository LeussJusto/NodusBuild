import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';

export default function ProjectCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', description: '', scope: { objectives: [], deliverables: [] }, budget: { total: 0 }, location: { address: '' } });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/projects', form);
      navigate(`/projects/${data._id}`);
    } catch (e) {
      setError(e?.response?.data?.message || 'No se pudo crear el proyecto');
    }
  };

  return (
    <div style={{ maxWidth: 560 }}>
      <h2>Nuevo proyecto</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div>
          <label>Descripción</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div>
          <label>Presupuesto total (PEN)</label>
          <input type="number" value={form.budget.total} onChange={(e) => setForm({ ...form, budget: { ...form.budget, total: Number(e.target.value) } })} />
        </div>
        <div>
          <label>Dirección</label>
          <input value={form.location.address} onChange={(e) => setForm({ ...form, location: { ...form.location, address: e.target.value } })} />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Crear</button>
      </form>
    </div>
  );
}
