# GOV.UK Fastify Starter

A production-ready Fastify + TypeScript starter project for building GOV.UK Design System compliant government websites with PostgreSQL database integration.

## Features

- ✅ **Fastify 5** server framework
- ✅ **TypeScript 5** with strict mode and ESM modules
- ✅ **Nunjucks** templating with **GOV.UK Frontend 5.14** macros
- ✅ **Prisma 7.3** ORM with PostgreSQL support
- ✅ **Zod 4** for type-safe form validation
- ✅ **Accessible by default** checking WCAG 2.2 AA standards
- ✅ **Native Environment Loading** using Node.js `--env-file` (Node 20+)

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) v20.0.0 or later (Required for `--env-file` support)
- [PostgreSQL](https://www.postgresql.org/) v14 or later
- npm package manager

## Quick Start

### 1. Clone the repository

```bash
git clone <repository-url>
cd govuk-fastify-starter
```

### 2. Install dependencies

```bash
npm install
```

This will:

- Install all Node.js dependencies
- Generate the Prisma client
- Copy GOV.UK Frontend assets to the public directory

### 3. Configure environment variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and set your database connection string and other variables:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/govuk_starter"
NODE_ENV="development"
PORT=3000
```

### 4. Set up the database

Create the database and push the schema:

```bash
# Push schema to database
npm run db:push

# (Optional) Seed with example data
npm run db:seed
```

### 5. Build the CSS

```bash
npm run build
```

### 6. Start the development server

```bash
npm run dev
```

The server uses Node's native `--env-file=.env` flag to load environment variables.
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```text
govuk-fastify-starter/
├── dist/                     # Compiled JS files (ESM)
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts               # Seed script
├── public/                   # Static assets
│   ├── assets/               # GOV.UK fonts/images
│   ├── javascripts/          # Client-side JS
│   └── stylesheets/          # Compiled CSS
├── scripts/
│   └── copy-govuk-assets.js  # Asset copy script
├── src/
│   ├── lib/
│   │   ├── prisma.ts         # Database client
│   │   └── validation.ts     # Zod schemas
│   ├── plugins/
│   │   └── nunjucks.ts       # View engine setup
│   ├── routes/
│   │   ├── index.ts          # Home route
│   │   └── example-form.ts   # Form routes
│   ├── views/                # Nunjucks templates
│   │   ├── layout.njk        # Base layout
│   │   ├── index.njk
│   │   └── example-form/
│   ├── env.ts                # (Removed - using fastify-env)
│   └── server.ts             # App entry point
├── .env.example
├── package.json
└── tsconfig.json
```

## Available Scripts

| Script | Description |
| ------ | ----------- |
| `npm run dev` | Start development server with file watching |
| `npm run build` | Compile TypeScript to JavaScript in `dist/` |
| `npm run start` | Start production server from `dist/` |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push schema changes to database |
| `npm run db:seed` | Seed database |
| `npm run db:studio` | Open Prisma Studio GUI |
| `npm run test` | Run unit and integration tests (Vitest) |
| `npm run test:watch` | Run unit tests in watch mode |
| `npm run test:e2e` | Run end-to-end tests (Playwright) |
| `npm run test:a11y` | Run accessibility tests |

## Testing

### Unit & Integration (Vitest)

We use **Vitest** for unit and component/integration testing.

- **Unit Tests**: Located in `tests/unit/`. Test individual functions and schemas (e.g., Zod validation).
- **Integration Tests**: Located in `tests/integration/`. Test API routes and server logic using `fastify.inject()` and mocked database calls.

```bash
# Run all unit/integration tests
npm test

# Run in watch mode
npm run test:watch
```

### End-to-End & Accessibility (Playwright)

We use **Playwright** for end-to-end testing and `axe-core` for accessibility auditing.

```bash
# Run all E2E tests
npm run test:e2e

# Run with UI
npm run test:e2e:ui

# Run accessibility check specifically
npm run test:a11y
```

Tests are located in `tests/e2e/`.

## Using GDS Components

This project uses Nunjucks macros provided by `govuk-frontend`.

**Example: `src/views/example.njk`**

```njk
{% extends "layout.njk" %}
{% from "govuk/components/button/macro.njk" import govukButton %}
{% from "govuk/components/input/macro.njk" import govukInput %}

{% block content %}
  <h1 class="govuk-heading-xl">Example Page</h1>

  <form action="/submit" method="post">
    {{ govukInput({
      label: {
        text: "Email address"
      },
      id: "email",
      name: "email",
      errorMessage: errors.email and {
        text: errors.email.message
      }
    }) }}

    {{ govukButton({
      text: "Save and continue"
    }) }}
  </form>
{% endblock %}
```

## Form Handling & Validation

Form submissions are handled by Fastify routes in `src/routes/`. Validation is performed using Zod.

```typescript
// src/routes/example-form.ts
import { contactFormSchema } from '../lib/validation.js';

server.post('/submit', async (request, reply) => {
  const result = contactFormSchema.safeParse(request.body);
  
  if (!result.success) {
    // Render view with errors
    return reply.view('example-form/index.njk', {
      errors: result.error.format(),
      values: request.body
    });
  }

  // Save to database logic...
  return reply.redirect('/success');
});
```

## Environment Variables

We use **Native Node.js Environment Loading** and **Fastify Env** for validation.

- **Loading**: `node --env-file=.env` injects variables into `process.env`.
- **Validation**: `@fastify/env` validates `process.env` against a JSON schema on server startup.

**Required Variables:**

- `DATABASE_URL`: PostgreSQL connection string

**Optional Variables:**

- `NODE_ENV`: Defaults to 'development'
- `PORT`: Defaults to 3000

## Deployment

1. **Build the application:**

   ```bash
   npm run build
   ```

2. **Start the server:**
   Ensure your environment variables are set (either via `.env` file or system environment).

   ```bash
   npm run start
   ```

This runs the compiled code from the `dist/` directory.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License

## Resources

- [Fastify Documentation](https://www.fastify.io/docs/latest/)
- [GOV.UK Design System](https://design-system.service.gov.uk/)
- [Nunjucks Documentation](https://mozilla.github.io/nunjucks/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Zod Documentation](https://zod.dev)
