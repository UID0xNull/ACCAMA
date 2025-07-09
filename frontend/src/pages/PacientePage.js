import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { apiFetch } from '../services/api';

export default function PacientePage() {
  const { token } = useContext(AuthContext);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    apiFetch('/legal-records/1', { token })
      .then(setRecords)
      .catch(() => {});
  }, [token]);

  return (
    <div>
      <h2>Área Paciente</h2>
      <ul>
        {records.map(r => (
          <li key={r.id}>{r.type}</li>
        ))}
      </ul>
    </div>
  );
}