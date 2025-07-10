import { useContext, useEffect, useState } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import { AuthContext } from '../context/AuthContext';
import { apiFetch } from '../lib/api';
import { parseJwt } from '../lib/jwt';

function Admin() {
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
    } catch {
      setError('Error al registrar');
    }
  };

  return (
        <div className="p-8">
      <h2 className="text-2xl mb-4">Área Administrador</h2>
      <form onSubmit={handleSubmit} className="space-y-2 mb-4">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Nombre" className="border p-2" />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="border p-2" />
        <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Contraseña" className="border p-2" />
        <input name="role" value={form.role} onChange={handleChange} placeholder="Rol" className="border p-2" />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white">Registrar</button>
        {error && <span className="text-red-500">{error}</span>}
      </form>
      <ul className="list-disc pl-6">
        {users.map(u => (
          <li key={u.id}>{u.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default function AdminPage() {
  return (
    <ProtectedRoute roles={["admin"]}>
      <Admin />
    </ProtectedRoute>
  );
}