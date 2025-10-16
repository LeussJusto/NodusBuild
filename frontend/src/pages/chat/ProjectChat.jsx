import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../lib/api';

export default function ProjectChat() {
  const { id } = useParams();
  const [channel, setChannel] = useState('general');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const query = useMemo(() => ({ channel, page, limit }), [channel, page, limit]);

  const load = async () => {
    try {
      const { data } = await api.get(`/projects/${id}/chat`, { params: query });
      setMessages(data);
    } catch (e) {
      setError(e?.response?.data?.message || 'No se pudieron cargar mensajes');
    }
  };

  useEffect(() => { load(); }, [id, channel, page, limit]);

  const send = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      await api.post(`/projects/${id}/chat`, { message: text, channel });
      setText('');
      await load();
    } catch (e) {
      setError('No se pudo enviar');
    }
  };

  const remove = async (msgId) => {
    try {
      await api.delete(`/chat/${msgId}`);
      await load();
    } catch (e) {
      setError('No se pudo eliminar');
    }
  };

  return (
    <div>
      <h2>Chat del proyecto</h2>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <label>
          Canal
          <select value={channel} onChange={(e) => setChannel(e.target.value)} style={{ marginLeft: 8 }}>
            <option value="general">general</option>
            <option value="calidad">calidad</option>
            <option value="produccion">producción</option>
            <option value="especialidades">especialidades</option>
          </select>
        </label>
        <label>
          Página
          <input type="number" min={1} value={page} onChange={(e) => setPage(Number(e.target.value) || 1)} style={{ width: 64, marginLeft: 8 }} />
        </label>
        <label>
          Límite
          <input type="number" min={5} value={limit} onChange={(e) => setLimit(Number(e.target.value) || 20)} style={{ width: 64, marginLeft: 8 }} />
        </label>
        <button onClick={load}>Actualizar</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ border: '1px solid #333', padding: 12, minHeight: 240, marginTop: 12 }}>
        {messages.map(m => (
          <div key={m._id} style={{ borderBottom: '1px dashed #444', padding: '6px 0' }}>
            <div style={{ fontSize: 12, opacity: 0.75 }}>
              {m.sender?.email || m.sender} — {new Date(m.createdAt).toLocaleString()} — canal: {m.channel}
            </div>
            <div>{m.message}</div>
            <button onClick={() => remove(m._id)} style={{ fontSize: 12, marginTop: 4 }}>Eliminar</button>
          </div>
        ))}
      </div>

      <form onSubmit={send} style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <input
          placeholder="Escribe un mensaje"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ flex: 1 }}
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}
