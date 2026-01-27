export const homeContent = {
  title: "Home",
  heading: "GOV.UK Fastify Starter",
  intro:
    "A production-ready Fastify starter project for building GOV.UK Design System compliant government websites.",
  featuresIntro: "Features",
  featuresListValues: [
    "Fastify w/ TypeScript",
    "GOV.UK Frontend 5.14 with automatic styling imports",
    "Prisma ORM with PostgreSQL for database operations",
    "Zod validation for type-safe form handling",
    "Nunjucks macros wrapping GDS patterns",
    "Accessible by default following WCAG 2.2 AA standards",
  ],
  startButton: "Try the example form",
  gettingStartedIntro: "Getting started",
  gettingStartedText:
    "This starter project includes everything you need to build a GDS-compliant service:",
  gettingStartedSteps: [
    'Clone the repository and install dependencies with <strong class="govuk-bold">npm install</strong>',
    'Copy <strong class="govuk-bold">.env.example</strong> to <strong class="govuk-bold">.env</strong> and configure your database',
    'Run database migrations with <strong class="govuk-bold">npm run db:migrate</strong>',
    'Start the development server with <strong class="govuk-bold">npm run dev</strong>',
  ],
  usefulLinksIntro: "Useful links",
  usefulLinks: [
    {
      text: "GOV.UK Design System",
      href: "https://design-system.service.gov.uk/",
    },
    {
      text: "GOV.UK Frontend documentation",
      href: "https://frontend.design-system.service.gov.uk/",
    },
    { text: "Fastify documentation", href: "https://fastify.dev/docs/latest/" },
    { text: "Prisma documentation", href: "https://www.prisma.io/docs" },
  ],
  disclaimer:
    "This is a starter template. Replace this content with your service's actual content before going live.",
};
