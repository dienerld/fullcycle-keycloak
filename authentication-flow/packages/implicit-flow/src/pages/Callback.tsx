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

    if (!accessToken || !idToken || !state) {
      throw new Error('Invalid callback');
    }
    login(accessToken, idToken, state);
  }, [hash, login, auth, navigate]);

  return (
    <>
      <p>...Carregando</p>
    </>
  );
}
