import { FastifyInstance } from "fastify";

export default async (fastify: FastifyInstance) => {
  fastify.get('/', async (request, reply) => {
    const loginParams = new URLSearchParams({
      client_id: 'fc-client',
      redirect_uri: 'http://localhost:3000/auth/callback',
      response_type: 'code',
      scope: 'openid',
    });
    const url = `http://localhost:8083/realms/fc-realm/protocol/openid-connect/auth?${loginParams.toString()}`;
    reply.redirect(url);
  })

  fastify.get('/callback', async (request, reply) => {
    const { code } = request.query as { code: string };
    const params = new URLSearchParams({
      client_id: 'fc-client',
      grant_type: 'authorization_code',
      redirect_uri: 'http://localhost:3000/auth/callback',
      code: code,
    });
    const url = 'http://keycloak:8080/realms/fc-realm/protocol/openid-connect/token';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });
    const data = await response.json();
    reply.send(data);
  })
}
