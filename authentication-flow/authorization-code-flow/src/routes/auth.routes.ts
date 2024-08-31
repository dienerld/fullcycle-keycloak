import crypto from 'node:crypto';
import { FastifyInstance } from 'fastify';
import { decode as JwtDecode } from 'jsonwebtoken';

type ResponseKeycloak = {
  access_token: string;
  refresh_token: string;
  id_token: string;
  token_type: string;
};

type PayloadJWT = Record<string, unknown>;

export default async (fastify: FastifyInstance) => {
  fastify.get('/', async (request, reply) => {
    const nonce = crypto.randomBytes(16).toString('hex');

    request.session.set('nonce', nonce);
    request.session.save();

    const loginParams = new URLSearchParams({
      client_id: 'fc-client',
      redirect_uri: 'http://localhost:3000/auth/callback',
      response_type: 'code',
      scope: 'openid',
      nonce,
    });
    const url = `http://localhost:8083/realms/fc-realm/protocol/openid-connect/auth?${loginParams.toString()}`;
    reply.redirect(url);
  });

  fastify.get('/callback', async (request, reply) => {
    const { code } = request.query as { code: string };
    const params = new URLSearchParams({
      client_id: 'fc-client',
      grant_type: 'authorization_code',
      redirect_uri: 'http://localhost:3000/auth/callback',
      code,
    });
    const url =
      'http://keycloak:8080/realms/fc-realm/protocol/openid-connect/token';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });
    const result = (await response.json()) as ResponseKeycloak;

    const payloadAccessToken = JwtDecode(result.access_token) as PayloadJWT;
    const payloadRefreshToken = JwtDecode(result.refresh_token) as PayloadJWT;
    const payloadIdToken = JwtDecode(result.id_token) as PayloadJWT;

    if (!payloadAccessToken || !payloadRefreshToken || !payloadIdToken) {
      return reply.code(401).send('Invalid token');
    }

    if (
      payloadAccessToken.nonce !== request.session.nonce ||
      payloadRefreshToken.nonce !== request.session.nonce ||
      payloadIdToken.nonce !== request.session.nonce
    ) {
      return reply.code(401).send('Invalid nonce');
    }

    request.session.set('user', payloadAccessToken);
    request.session.set('accessToken', result.access_token);
    request.session.set('refreshToken', result.refresh_token);
    request.session.set('idToken', result.id_token);
    request.session.save();

    return reply.code(200).send(result);
  });
};
