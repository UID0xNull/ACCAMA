import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoute({ children, roles }) {
  const { token, role } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!token) router.replace('/login');
    else if (roles && !roles.includes(role)) router.replace('/');
  }, [token, role]);

  if (!token) return null;
  if (roles && !roles.includes(role)) return null;
  return children;
}