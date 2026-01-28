import { FastifyInstance } from 'fastify';
import { confirmationContent } from '../../content/example-form/confirmation.js';
import { commonContent } from '../../content/common.js';

export default async function (fastify: FastifyInstance) {
  // GET /example-form/confirmation
  fastify.get('/example-form/confirmation', async (request, reply) => {
      const { email } = request.query as { email?: string };
      return reply.view("example-form/confirmation.njk", {
        email,
        content: confirmationContent,
        common: commonContent,
      });
  });
}
