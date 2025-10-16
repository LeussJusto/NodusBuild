import React from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Layout from './components/Layout'
import ProjectsList from './pages/projects/ProjectsList'
import ProjectCreate from './pages/projects/ProjectCreate'
import ProjectDetail from './pages/projects/ProjectDetail'
import ProjectTasks from './pages/tasks/ProjectTasks'
import TaskCreate from './pages/tasks/TaskCreate'
import TaskDetail from './pages/tasks/TaskDetail'
import ReportsList from './pages/reports/ReportsList'
import ReportCreate from './pages/reports/ReportCreate'
import ReportDetail from './pages/reports/ReportDetail'
import DocumentsList from './pages/documents/DocumentsList'
import DocumentUpload from './pages/documents/DocumentUpload'
import ActivityLogs from './pages/activity/ActivityLogs'
import ActivityLogCreate from './pages/activity/ActivityLogCreate'
import Notifications from './pages/notifications/Notifications'
import ProjectChat from './pages/chat/ProjectChat'

function Dashboard() {
  const { user, logout } = useAuth();
  return (
    <div style={{ padding: 24 }}>
      <h2>Dashboard</h2>
      <p>Bienvenido{user?.profile?.firstName ? `, ${user.profile.firstName}` : ''}.</p>
      <nav style={{ display: 'flex', gap: 12 }}>
        <Link to="/projects">Proyectos</Link>
        <Link to="/notifications">Notificaciones</Link>
      </nav>
      <button onClick={logout} style={{ marginTop: 12 }}>Cerrar sesión</button>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<ProjectsList />} />
          <Route path="/projects/new" element={<ProjectCreate />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/projects/:id/tasks" element={<ProjectTasks />} />
          <Route path="/projects/:id/tasks/new" element={<TaskCreate />} />
          <Route path="/tasks/:taskId" element={<TaskDetail />} />
          <Route path="/projects/:id/reports" element={<ReportsList />} />
          <Route path="/projects/:id/reports/new" element={<ReportCreate />} />
          <Route path="/reports/:reportId" element={<ReportDetail />} />
          <Route path="/documents" element={<DocumentsList />} />
          <Route path="/documents/upload" element={<DocumentUpload />} />
          <Route path="/projects/:id/activity" element={<ActivityLogs />} />
          <Route path="/projects/:id/activity/new" element={<ActivityLogCreate />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/projects/:id/chat" element={<ProjectChat />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
