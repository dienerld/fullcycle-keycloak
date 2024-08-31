import { FastifyInstance } from "fastify";

export default async (fastify: FastifyInstance) => {
  fastify.get('/', async (request, reply) => {
    const user = {
      name: 'John Doe',
      email: 'john.doe@example.com'
    };
    reply.send(user);
  });
}
