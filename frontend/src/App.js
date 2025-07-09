import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Hero from './components/Hero';
import SobreNosotros from './components/SobreNosotros';
import Login from './pages/Login';
import PacientePage from './pages/PacientePage';
import MedicoPage from './pages/MedicoPage';
import LegalPage from './pages/LegalPage';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/paciente"
        element={
          <ProtectedRoute>
            <PacientePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/medico"
        element={
          <ProtectedRoute roles={["doctor"]}>
            <MedicoPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/legal"
        element={
          <ProtectedRoute roles={["legal"]}>
            <LegalPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function Home() {
  return (
    <div>
      <Hero />
      <SobreNosotros />
    </div>
  );
}

export default App;