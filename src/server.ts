import Fastify, { FastifyInstance } from 'fastify';
import path from 'path';
import fastifyStatic from '@fastify/static';
import fastifyFormbody from '@fastify/formbody';
import fastifyEnv from '@fastify/env';
import nunjucksPlugin from './plugins/nunjucks.js';


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
  dotenv: true // Load .env if present, but don't fail if missing (handled by library/schema validation)
};

export async function buildApp(opts: any = {}) {
  const app = Fastify({
    logger: process.env.NODE_ENV === 'development' ? {
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      },
    } : true,
    ...opts
  });

  // Register Plugins
  await app.register(fastifyEnv, options);
  await app.register(fastifyFormbody);
  await app.register(nunjucksPlugin);

  // Register Static Files
  // Serve public assets
  await app.register(fastifyStatic, {
    root: path.join(process.cwd(), 'public'),
    prefix: '/',
  });

  // Register Routes
  const { default: indexRoutes } = await import('./routes/index.js');
  await app.register(indexRoutes);

  const { default: exampleFormRoutes } = await import('./routes/example-form.js');
  await app.register(exampleFormRoutes);

  // Basic health check
  app.get('/health', async () => ({ status: 'ok' }));

  return app;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  (async () => {
    try {
      const server = await buildApp();
      
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
  })();
}

