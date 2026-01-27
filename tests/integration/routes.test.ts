import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { buildApp } from '../../src/server';
import { FastifyInstance } from 'fastify';
import prisma from '../../src/lib/prisma'; // This will be mocked

// Mock Prisma
vi.mock('../../src/lib/prisma', () => ({
  default: {
    contactSubmission: {
      create: vi.fn(),
    },
  },
}));

describe('Server Integration Tests', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    // Set necessary env vars for fastify-env validation
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
    process.env.NODE_ENV = 'test';

    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /health should return status ok', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/health',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: 'ok' });
  });

  it('GET / should return 200', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/',
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toContain('text/html');
  });

  describe('Example Form', () => {
    it('GET /example-form should return 200', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/example-form',
        });
    
        expect(response.statusCode).toBe(200);
        expect(response.headers['content-type']).toContain('text/html');
    });

    it('POST /example-form with invalid data should return 200 (re-render)', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/example-form',
            payload: {
                fullName: '',
                email: 'invalid-email',
                subject: '',
                message: ''
            }
        });

        // Fastify view rendering returns 200 even on validation error usually, unless configured otherwise
        expect(response.statusCode).toBe(200); 
        expect(response.payload).toContain('govuk-error-summary');
        expect(response.payload).toContain('Enter your full name');
    });

    it('POST /example-form with valid data should redirect and save to DB', async () => {
        const validData = {
            fullName: 'Test User',
            email: 'test@example.com',
            subject: 'Test Subject',
            message: 'This is a test message that is long enough.'
        };

        // Mock success
        vi.mocked(prisma.contactSubmission.create).mockResolvedValue({
            id: '1',
            createdAt: new Date(),
            ...validData
        } as any);

        const response = await app.inject({
            method: 'POST',
            url: '/example-form',
            payload: validData
        });

        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toContain('/example-form/confirmation');
        
        expect(prisma.contactSubmission.create).toHaveBeenCalledWith({
            data: validData
        });
    });
  });
});
