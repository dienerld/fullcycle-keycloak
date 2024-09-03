import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../context/auth';

export function Callback() {
  const { hash } = useLocation();
  const { login, auth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth) {
      navigate('/admin');
      return;
    }

    const searchParams = new URLSearchParams(hash.replace('#', ''));
    const accessToken = searchParams.get('access_token');
    const idToken = searchParams.get('id_token');
    const state = searchParams.get('state');
    const code = searchParams.get('code');

    if (!accessToken || !idToken || !state || !code) {
      throw new Error('Invalid callback');
    }
    login(accessToken, idToken, code, state);
  }, [hash, login, auth, navigate]);

  return (
    <>
      <p>...Carregando</p>
    </>
  );
}
