import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', profile: { firstName: '', lastName: '' } });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await register(form);
    if (res.ok) {
      setMessage('Registro exitoso. Ahora puedes iniciar sesión.');
      setError('');
      setTimeout(() => navigate('/login'), 1200);
    } else {
      setError(res.message || 'No se pudo registrar');
      setMessage('');
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: '64px auto' }}>
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombres</label>
          <input value={form.profile.firstName} onChange={(e) => setForm({ ...form, profile: { ...form.profile, firstName: e.target.value } })} />
        </div>
        <div>
          <label>Apellidos</label>
          <input value={form.profile.lastName} onChange={(e) => setForm({ ...form, profile: { ...form.profile, lastName: e.target.value } })} />
        </div>
        <div>
          <label>Email</label>
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div>
          <label>Contraseña</label>
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {message && <p style={{ color: 'green' }}>{message}</p>}
        <button type="submit" disabled={loading}>{loading ? 'Registrando...' : 'Registrar'}</button>
      </form>
      <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
    </div>
  );
}
