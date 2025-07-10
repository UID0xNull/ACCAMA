import { useContext, useEffect, useState } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import { AuthContext } from '../context/AuthContext';
import { apiFetch } from '../lib/api';

function Medico() {
  const { token } = useContext(AuthContext);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    apiFetch('/patients', { token })
      .then(setPatients)
      .catch(() => {});
  }, [token]);

  return (
    <div className="p-8">
      <h2 className="text-2xl mb-4">Área Médico</h2>
      <ul className="list-disc pl-6">
        {patients.map(p => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default function MedicoPage() {
  return (
    <ProtectedRoute roles={["doctor"]}>
      <Medico />
    </ProtectedRoute>
  );
}