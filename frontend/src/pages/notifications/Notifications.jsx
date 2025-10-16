import React, { useEffect, useState } from 'react';
import api from '../../lib/api';

export default function Notifications() {
  const [list, setList] = useState([]);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const { data } = await api.get('/notifications');
      setList(data);
    } catch (e) {
      setError(e?.response?.data?.message || 'No se pudieron cargar notificaciones');
    }
  };

  useEffect(() => { load(); }, []);

  const markAll = async () => {
    try {
      await api.post('/notifications/read-all');
      await load();
    } catch (e) {
      setError('No se pudo marcar como leídas');
    }
  };

  const markOne = async (id) => {
    try {
      await api.post(`/notifications/${id}/read`);
      await load();
    } catch (e) {
      setError('No se pudo marcar');
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      await load();
    } catch (e) {
      setError('No se pudo eliminar');
    }
  };

  return (
    <div>
      <h2>Notificaciones</h2>
      <button onClick={markAll}>Marcar todas como leídas</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {list.map(n => (
          <li key={n._id}>
            <strong>{n.title}</strong> — {n.message} {n.read ? '(leída)' : ''}
            <button onClick={() => markOne(n._id)} style={{ marginLeft: 8 }}>Marcar</button>
            <button onClick={() => remove(n._id)} style={{ marginLeft: 8 }}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
