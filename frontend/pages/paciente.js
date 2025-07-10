import { useContext, useEffect, useState } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import { AuthContext } from '../context/AuthContext';
import { apiFetch } from '../lib/api';
import { parseJwt } from '../lib/jwt';

function Paciente() {
  const { token } = useContext(AuthContext);
  const [userId, setUserId] = useState(null);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const payload = parseJwt(token);
    setUserId(payload?.id || null);
  }, [token]);

  useEffect(() => {
    if (!userId) return;
    apiFetch(`/legal-records/${userId}`, { token })
      .then(setRecords)
      .catch(() => {});
  }, [token, userId]);

  return (
    <div className="p-8">
      <h2 className="text-2xl mb-4">Área Paciente</h2>
      <ul className="list-disc pl-6">
        {records.map(r => (
          <li key={r.id}>{r.type}</li>
        ))}
      </ul>
    </div>
  );
}

export default function PacientePage() {
  return (
    <ProtectedRoute>
      <Paciente />
    </ProtectedRoute>
  );
}