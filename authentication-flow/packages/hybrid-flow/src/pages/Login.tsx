import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/auth';

export function Login() {
  const { auth, makeLoginUrl } = useAuth();

  useEffect(() => {
    if (!auth) {
      setTimeout(() => {
        window.location.href = makeLoginUrl();
      }, 1000);
    }
  }, [auth, makeLoginUrl]);

  return auth ? (
    <Navigate to="/admin" />
  ) : (
    <div>
      <h1 className="animate-bounce text-2xl">...Carregando</h1>
    </div>
  );
}
