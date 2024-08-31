// fastify-session.d.ts
import 'fastify';
import '@fastify/session';

declare module 'fastify' {

  interface Session {
    // configurations keycloak
    nonce?: string;
    state?: string;

    // user information
    user?: Record<string, unknown>;
    accessToken?: string;
    refreshToken?: string;
    idToken?: string;
  }
}
