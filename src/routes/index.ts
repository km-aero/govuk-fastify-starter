import { FastifyInstance } from 'fastify';
import { homeContent } from '../content/home.js';

export default async function (fastify: FastifyInstance) {
  fastify.get('/', async (request, reply) => {
    return reply.view('index.njk', { content: homeContent });
  });
}
