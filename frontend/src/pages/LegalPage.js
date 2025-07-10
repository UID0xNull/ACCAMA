import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { apiFetch } from '../services/api';
import { parseJwt } from '../utils/jwt';

export default function LegalPage() {
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
    <div>
      <h2>Área Legal</h2>
      <ul>
        {records.map(r => (
          <li key={r.id}>{r.type}</li>
        ))}
      </ul>
    </div>
  );
}
