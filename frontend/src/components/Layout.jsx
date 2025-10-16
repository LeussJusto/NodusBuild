import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: '100vh' }}>
      <aside style={{ background: '#111827', color: '#fff', padding: 16 }}>
        <h3 style={{ marginTop: 0 }}>Constructora PyME</h3>
        <p style={{ fontSize: 12, opacity: 0.8 }}>{user?.email}</p>
        <nav style={{ display: 'grid', gap: 8 }}>
          <Link to="/" style={{ color: '#fff' }}>Dashboard</Link>
          <Link to="/projects" style={{ color: '#fff' }}>Proyectos</Link>
          <Link to="/documents" style={{ color: '#fff' }}>Documentos</Link>
          <Link to="/reports" style={{ color: '#fff' }}>Reportes</Link>
          <Link to="/activity" style={{ color: '#fff' }}>Actividad / PPC</Link>
          <Link to="/notifications" style={{ color: '#fff' }}>Notificaciones</Link>
        </nav>
        <button onClick={logout} style={{ marginTop: 16 }}>Cerrar sesión</button>
      </aside>
      <main style={{ padding: 24 }}>
        <Outlet />
      </main>
    </div>
  );
}
