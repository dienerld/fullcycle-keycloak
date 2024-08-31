import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { makeLoginUrl } from '../utils/auth';

export function Login() {
  const authContext = {
    auth: false,
  };

  useEffect(() => {
    if (!authContext.auth) {
      setTimeout(() => {
        window.location.href = makeLoginUrl();
      }, 5000);
    }
  }, [authContext.auth]);

  return authContext.auth ? (
    <Navigate to="/admin" />
  ) : (
    <div>
      <h1>...Carregando</h1>
    </div>
  );
}
