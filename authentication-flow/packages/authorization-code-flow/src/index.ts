import Fastify from 'fastify';
import fastifySession from '@fastify/session';
import fastifyCookie from '@fastify/cookie';

const fastify = Fastify({
  logger: true,
});

fastify.register(fastifyCookie);
fastify.register(fastifySession, {
  secret: 'secret-have-minimum-32-characters',
});

/// Declare a route
fastify.get('/', function (request, reply) {
  reply.send({ hello: 'world' });
});

fastify.register(require('./routes/user.routes'), { prefix: '/user' });
fastify.register(require('./routes/auth.routes'), { prefix: '/auth' });

// Run the server!
fastify.listen({ port: 3000, host: '0.0.0.0' }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  // Server is now listening on ${address}
  console.log(`Server listening on ${address}`);
});
