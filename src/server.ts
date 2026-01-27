import Fastify, { FastifyInstance } from 'fastify';
import path from 'path';
import fastifyStatic from '@fastify/static';
import fastifyFormbody from '@fastify/formbody';
import fastifyEnv from '@fastify/env';
import nunjucksPlugin from './plugins/nunjucks.js';
import indexRoutes from './routes/index.js';
import exampleFormRoutes from './routes/example-form.js';


const schema = {
  type: 'object',
  required: ['DATABASE_URL',],
  properties: {
    DATABASE_URL: {
      type: 'string',
      default: 'postgres://postgres:password@localhost:5432/postgres'
    },
    NODE_ENV: {
      type: 'string',
      default: 'development'
    },
    PORT: {
      type: 'number',
      default: 3000
    }
  }
};

const options = {
  confKey: 'config',
  schema: schema,
  data: process.env // Explicitly pass process.env to validate it
};

async function main() {
  try {
    const server = Fastify({
      logger: process.env.NODE_ENV === 'development' ? {
        transport: {
          target: 'pino-pretty',
          options: {
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
          },
        },
      } : true,
    });

    // Register Plugins
    await server.register(fastifyEnv, options);
    await server.register(fastifyFormbody);
    await server.register(nunjucksPlugin);

    // Register Static Files
    // Serve public assets
    await server.register(fastifyStatic, {
      root: path.join(process.cwd(), 'public'),
      prefix: '/',
    });

    // Register Routes
    await server.register(indexRoutes);
    await server.register(exampleFormRoutes);

    // Basic health check
    server.get('/health', async () => ({ status: 'ok' }));
    
    // Wait for plugins to be ready (load env)
    await server.ready();

    // Start server
    // @ts-ignore - config is added by fastify-env
    const port = server.config.PORT;
    // @ts-ignore - config is added by fastify-env
    await server.listen({ port, host: '0.0.0.0' });
    console.log(`Server listening at http://localhost:${port}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
