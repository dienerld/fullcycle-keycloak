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
    response_type: 'token id_token code',
    scope: 'openid',
    nonce,
    state,
  });

  const url = `http://localhost:8083/realms/fc-realm/protocol/openid-connect/auth?${loginParams.toString()}`;
  return url;
}

export function login(
  accessToken: string,
  idToken: string | null,
  refreshToken?: string,
  state?: string,
) {
  const stateCookie = Cookies.get('state');
  if (state && stateCookie !== state) {
    throw new Error('Invalid state');
  }

  const decodedAccessToken = jwtDecode(accessToken) as Record<string, unknown>;
  const decodedIdToken = idToken ? (jwtDecode(idToken) as Record<string, unknown>) : null;
  const decodedRefreshToken = refreshToken
    ? (jwtDecode(refreshToken) as Record<string, unknown>)
    : null;

  if (
    decodedAccessToken.nonce !== Cookies.get('nonce') ||
    (decodedIdToken && decodedIdToken.nonce !== Cookies.get('nonce')) ||
    (decodedRefreshToken && decodedRefreshToken.nonce !== Cookies.get('nonce'))
  ) {
    throw new Error('Invalid token');
  }

  Cookies.set('accessToken', accessToken);
  if (idToken) {
    Cookies.set('idToken', idToken);
  }
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

export function exchangeCodeForTokens(code: string) {
  const tokenUrlParams = new URLSearchParams({
    client_id: 'fullcycle-client',
    grant_type: 'authorization_code',
    code,
    redirect_uri: 'http://localhost:5173/callback',
    nonce: Cookies.get('nonce') as string,
  });

  return fetch('http://localhost:8083/realms/fc-realm/protocol/openid-connect/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: tokenUrlParams.toString(),
  })
    .then((res) => res.json())
    .then((res) => {
      return login(res.access_token, null, res.refresh_token);
    });
}
