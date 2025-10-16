import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../lib/api';

export default function TaskDetail() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const { data } = await api.get(`/tasks/${taskId}`);
      setTask(data);
    } catch (e) {
      setError(e?.response?.data?.message || 'No se pudo cargar la tarea');
    }
  };

  useEffect(() => { load(); }, [taskId]);

  const updateStatus = async (status) => {
    try {
      await api.put(`/tasks/${taskId}`, { status });
      await load();
    } catch (e) {
      setError('No se pudo actualizar');
    }
  };

  const remove = async () => {
    try {
      await api.delete(`/tasks/${taskId}`);
      navigate(-1);
    } catch (e) {
      setError('No se pudo eliminar');
    }
  };

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!task) return <p>Cargando...</p>;

  return (
    <div>
      <h2>{task.title}</h2>
      <p>{task.description}</p>
      <p>Estado: {task.status}</p>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => updateStatus('in_progress')}>Iniciar</button>
        <button onClick={() => updateStatus('completed')}>Completar</button>
        <button onClick={() => updateStatus('not_completed')}>No cumplida</button>
        <button onClick={remove}>Eliminar</button>
      </div>
    </div>
  );
}
