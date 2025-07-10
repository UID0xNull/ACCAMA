import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { apiFetch } from '../services/api';
import { parseJwt } from '../utils/jwt';

export default function AdminPage() {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: '' });
  const [error, setError] = useState(null);

  useEffect(() => {
    apiFetch('/users', { token })
      .then(data => setUsers(data.data || []))
      .catch(() => {});
  }, [token]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    try {
      const payload = parseJwt(token);
      await apiFetch('/auth/register', {
        method: 'POST',
        token,
        body: JSON.stringify({ ...form, ongId: payload?.ongId })
      });
      setForm({ name: '', email: '', password: '', role: '' });
      apiFetch('/users', { token })
        .then(data => setUsers(data.data || []))
        .catch(() => {});
    } catch (err) {
      setError('Error al registrar');
    }
  };

  return (
    <div>
      <h2>Área Administrador</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nombre"
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Contraseña"
        />
        <input
          name="role"
          value={form.role}
          onChange={handleChange}
          placeholder="Rol"
        />
        <button type="submit">Registrar</button>
        {error && <span>{error}</span>}
      </form>
      <ul>
        {users.map(u => (
          <li key={u.id}>{u.name}</li>
        ))}
      </ul>
    </div>
  );
}