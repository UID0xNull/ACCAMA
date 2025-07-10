import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../context/AuthContext';
import { apiFetch } from '../lib/api';
import { parseJwt } from '../lib/jwt';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();
  const { login } = useContext(AuthContext);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      const payload = parseJwt(data.token);
      login(data.token, payload.role);
      router.push('/');
    } catch {
      setError('Error de autenticación');
    }
  };

  return (
        <div className="p-8">
      <h2 className="text-2xl mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="border p-2" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" className="border p-2" />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white">Ingresar</button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}