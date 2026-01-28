import Fastify from 'fastify';
import path from 'path';
import fastifyCompress from '@fastify/compress';
import fastifyStatic from '@fastify/static';
import fastifyFormbody from '@fastify/formbody';
import fastifyEnv from '@fastify/env';
import fastifyHelmet from '@fastify/helmet';
import fastifyRateLimit from '@fastify/rate-limit';
import fastifyCsrfProtection from '@fastify/csrf-protection';
import fastifyCookie from '@fastify/cookie';
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
    },
    COOKIE_SECRET: {
      type: 'string',
      default: 'a-very-long-secret-key-for-cookies-must-be-at-least-32-chars'
    }
  }
};

const options = {
  confKey: 'config',
  schema: schema,
  dotenv: true // Load .env if present, but don't fail if missing (handled by library/schema validation)
};

export async function buildApp(opts: import('fastify').FastifyServerOptions = {}) {
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
  await app.register(fastifyFormbody);
  await app.register(fastifyEnv, options);
  if (process.env.NODE_ENV !== 'test') {
    await app.register(fastifyHelmet, {
      enableCSPNonces: true,
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'"],
          imgSrc: ["'self'", "data:"], // Images
          fontSrc: ["'self'", "data:"], // Fonts
        }
      }
    });
  }

  // Rate Limiting
  await app.register(fastifyRateLimit, {
    max: process.env.NODE_ENV === 'production' ? 100 : 5000,
    timeWindow: '1 minute'
  });

  // CSRF Protection
  await app.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET || 'a-very-long-secret-key-for-cookies-must-be-at-least-32-chars'
  });

  await app.register(fastifyCsrfProtection, {
    cookieOpts: { 
      signed: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    },
    getToken: (req) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const body = req.body as any;
      return body?._csrf;
    }
  });

  // Protect all updates with CSRF
  if (process.env.NODE_ENV !== 'test') {
    app.addHook('preValidation', async (req, reply) => {
      if (req.method !== 'GET' && req.method !== 'HEAD' && req.method !== 'OPTIONS' && req.method !== 'TRACE') {
        // @ts-expect-error - csrfProtection is added by fastify-csrf-protection
        await app.csrfProtection(req, reply);
      }
    });
  }
  
  // Make CSP nonce and CSRF token available to Nunjucks views
  app.addHook('onRequest', async (req, reply) => {
    // @ts-expect-error - cspNonce is added by fastify-helmet middleware
    reply.locals = reply.locals || {};
    if (reply.cspNonce) {
      // @ts-expect-error - cspNonce is added by fastify-helmet middleware
      reply.locals.scriptNonce = reply.cspNonce.script;
      // @ts-expect-error - cspNonce is added by fastify-helmet middleware
      reply.locals.styleNonce = reply.cspNonce.style;
    }

    // Generate CSRF token
    const csrfToken = await reply.generateCsrf();
    // @ts-expect-error - locals is not typed in default fastify reply
    reply.locals.csrfToken = csrfToken;
  });
  await app.register(fastifyCompress);
  await app.register(nunjucksPlugin);

  // Register Static Files
  // Serve public assets
  await app.register(fastifyStatic, {
    root: path.join(process.cwd(), 'public'),
    prefix: '/',
    maxAge: '1d',
  });

  // Register Routes
  const { default: indexRoutes } = await import('./routes/index.js');
  await app.register(indexRoutes);

  const { default: exampleFormRoutes } = await import('./routes/example-form/index.js');
  await app.register(exampleFormRoutes);

  const { default: exampleFormConfirmationRoutes } = await import('./routes/example-form/confirmation.js');
  await app.register(exampleFormConfirmationRoutes);

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
      // @ts-expect-error - config is added by fastify-env
      const port = server.config.PORT;
      await server.listen({ port, host: '0.0.0.0' });
      console.log(`Server listening at http://localhost:${port}`);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  })();
}

