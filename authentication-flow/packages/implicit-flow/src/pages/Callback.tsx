import { useLocation } from 'react-router-dom';
import { login } from '../utils/auth';
import { useEffect } from 'react';

export function Callback() {
  const { hash } = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(hash.replace('#', ''));
    const accessToken = searchParams.get('access_token');
    const idToken = searchParams.get('id_token');
    const state = searchParams.get('state');

    if (!accessToken || !idToken || !state) {
      throw new Error('Invalid callback');
    }

    console.log(accessToken, idToken, state);

    login(accessToken, idToken, state);
  }, [hash]);

  return (
    <>
      <p>...Carregando</p>
    </>
  );
}
