import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { contactFormContent } from '../content/example-form.js';

// Schema for validation
const contactSchema = z.object({
  fullName: z.string().min(1, contactFormContent.fields.fullName.error.required),
  email: z.string().email(contactFormContent.fields.email.error.invalid),
  subject: z.string().min(1, contactFormContent.fields.subject.error.required),
  message: z.string()
    .min(10, contactFormContent.fields.message.error.tooShort)
    .max(1000, contactFormContent.fields.message.error.tooLong),
});

export default async function (fastify: FastifyInstance) {
  // GET /example-form
  fastify.get('/example-form', async (request, reply) => {
    return reply.view('example-form/index.njk', { content: contactFormContent });
  });

  // POST /example-form
  fastify.post('/example-form', async (request, reply) => {
    // fastify-formbody parses body into request.body
    const data = request.body as Record<string, string>;
    
    // Validate
    const result = contactSchema.safeParse(data);

    if (!result.success) {
      // Map Zod errors to GOV.UK format
      const errors = result.error.flatten().fieldErrors;
      
      const errorSummary: { href: string; text: string }[] = [];
      const fieldErrors: Record<string, { text: string }> = {};

      for (const [key, msgs] of Object.entries(errors)) {
        const text = msgs?.[0] || 'Invalid value';
        errorSummary.push({
          href: `#${key}`,
          text: text,
        });

        if (msgs && msgs.length > 0) {
          fieldErrors[key] = { text: msgs[0] };
        }
      }

      // Re-render with errors
      return reply.view('example-form/index.njk', {
        values: data,
        errors: fieldErrors,
        errorSummary: errorSummary,
        content: contactFormContent,
      });
    }

    // Save to DB
    try {
        await prisma.contactSubmission.create({
            data: {
                fullName: result.data.fullName,
                email: result.data.email,
                subject: result.data.subject,
                message: result.data.message,
            },
        });
    } catch (e) {
        request.log.error(e);
        // Serve a generic error page or similar in real app
    }

    // Redirect to success
    const query = new URLSearchParams({ email: result.data.email });
    return reply.redirect(`/example-form/confirmation?${query.toString()}`);
  });

  // GET /example-form/confirmation
  fastify.get('/example-form/confirmation', async (request, reply) => {
      const { email } = request.query as { email?: string };
      return reply.view('example-form/confirmation.njk', { email, content: contactFormContent });
  });
}
