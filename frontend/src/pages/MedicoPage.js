import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { apiFetch } from '../services/api';

export default function MedicoPage() {
  const { token } = useContext(AuthContext);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    apiFetch('/patients', { token })
      .then(setPatients)
      .catch(() => {});
  }, [token]);

  return (
    <div>
      <h2>Área Médico</h2>
      <ul>
        {patients.map(p => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </div>
  );
}