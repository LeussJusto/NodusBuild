import React, { useState } from 'react';
import api from '../../lib/api';

export default function DocumentUpload() {
  const [file, setFile] = useState(null);
  const [project, setProject] = useState('');
  const [category, setCategory] = useState('certificate');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError('Seleccione un archivo');
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('project', project);
      form.append('category', category);
      await api.post('/documents/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage('Subido');
      setError('');
    } catch (e) {
      setMessage('');
      setError(e?.response?.data?.message || 'No se pudo subir');
    }
  };

  return (
    <div style={{ maxWidth: 480 }}>
      <h3>Subir documento</h3>
      <form onSubmit={onSubmit}>
        <div>
          <label>Proyecto ID</label>
          <input value={project} onChange={(e) => setProject(e.target.value)} required />
        </div>
        <div>
          <label>Categoría</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="certificate">Certificado</option>
            <option value="blueprint">Plano</option>
            <option value="report">Reporte</option>
            <option value="photo">Foto</option>
            <option value="video">Video</option>
            <option value="contract">Contrato</option>
            <option value="permit">Permiso</option>
          </select>
        </div>
        <div>
          <label>Archivo</label>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {message && <p style={{ color: 'green' }}>{message}</p>}
        <button type="submit">Subir</button>
      </form>
    </div>
  );
}
