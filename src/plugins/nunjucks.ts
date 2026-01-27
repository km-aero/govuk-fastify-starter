import fp from 'fastify-plugin';
import fastifyView from '@fastify/view';
import nunjucks from 'nunjucks';
import path from 'path';

export default fp(async (fastify) => {
  const templates = [
    path.join(process.cwd(), 'src/views'),
    path.join(process.cwd(), 'node_modules/govuk-frontend/dist'),
    path.join(process.cwd(), 'node_modules/govuk-frontend/dist/govuk'),
  ];

  await fastify.register(fastifyView, {
    engine: {
      nunjucks: nunjucks,
    },
    templates: templates,
    options: {
      autoescape: true,
      watch: process.env.NODE_ENV === 'development',
      noCache: process.env.NODE_ENV === 'development',
      onConfigure: (env: nunjucks.Environment) => {
        // Global variables expected by GOV.UK Frontend
        env.addGlobal('assetPath', '/assets/');
        env.addGlobal('serviceName', 'GOV.UK Fastify Starter');
        env.addGlobal('serviceUrl', '/');
        
        // Custom globals
        env.addGlobal('isDevelopment', process.env.NODE_ENV === 'development');
      }
    },
    viewExt: 'njk',
    propertyName: 'view',
  });
});
