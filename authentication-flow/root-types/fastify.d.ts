// fastify-session.d.ts
import 'fastify';
import '@fastify/session';

declare module 'fastify' {
  interface Session {
    nonce?: string;
    user?: Record<string, unknown>;
    accessToken?: string;
    refreshToken?: string;
    idToken?: string;
  }
}
