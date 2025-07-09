import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { apiFetch } from '../services/api';

export default function AdminPage() {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    apiFetch('/users', { token })
      .then(data => setUsers(data.data || []))
      .catch(() => {});
  }, [token]);

  return (
    <div>
      <h2>Área Administrador</h2>
      <ul>
        {users.map(u => (
          <li key={u.id}>{u.name}</li>
        ))}
      </ul>
    </div>
  );
}