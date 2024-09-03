import { useEffect } from 'react';
import { useAuth } from '../context/auth';

export function Logout() {
  const { makeLogoutUrl } = useAuth();

  useEffect(() => {
    const url = makeLogoutUrl();
    if (!url) {
      return;
    }
    window.location.href = url;
  }, [makeLogoutUrl]);

  return <p>Redirecionando...</p>;
}
