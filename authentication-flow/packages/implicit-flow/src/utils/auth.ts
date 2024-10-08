import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export function makeLoginUrl() {
  const nonce = Math.random().toString(36);
  const state = Math.random().toString(36);

  Cookies.set('nonce', nonce);
  Cookies.set('state', state);

  const loginParams = new URLSearchParams({
    client_id: 'fc-client',
    redirect_uri: 'http://localhost:5173/callback',
    response_type: 'token id_token',
    scope: 'openid',
    nonce,
    state,
  });

  const url = `http://localhost:8083/realms/fc-realm/protocol/openid-connect/auth?${loginParams.toString()}`;
  return url;
}

export function login(accessToken: string, idToken: string, state: string) {
  const stateCookie = Cookies.get('state');
  if (stateCookie !== state) {
    throw new Error('Invalid state');
  }

  const decodedAccessToken = jwtDecode(accessToken) as Record<string, unknown>;
  const decodedIdToken = jwtDecode(idToken) as Record<string, unknown>;

  if (
    decodedAccessToken.nonce !== Cookies.get('nonce') ||
    decodedIdToken.nonce !== Cookies.get('nonce')
  ) {
    throw new Error('Invalid token');
  }

  Cookies.set('accessToken', accessToken);
  Cookies.set('idToken', idToken);

  return decodedAccessToken;
}

export function getAuth() {
  const accessToken = Cookies.get('accessToken');

  if (!accessToken) {
    return null;
  }

  const decodedAccessToken = jwtDecode(accessToken) as Record<string, unknown>;
  return decodedAccessToken;
}

export function makeLogoutUrl() {
  if (!Cookies.get('idToken')) {
    return '';
  }

  const logoutParams = new URLSearchParams({
    // client_id: 'fc-client',
    id_token_hint: Cookies.get('idToken') as string,
    post_logout_redirect_uri: 'http://localhost:5173/logout',
  });

  Cookies.remove('accessToken');
  Cookies.remove('idToken');
  Cookies.remove('refreshToken');
  Cookies.remove('state');
  Cookies.remove('nonce');

  const url = `http://localhost:8083/realms/fc-realm/protocol/openid-connect/logout?${logoutParams.toString()}`;

  return url;
}
