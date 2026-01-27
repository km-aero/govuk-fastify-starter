import { describe, it, expect } from 'vitest';
import { contactFormSchema, feedbackFormSchema, validateFormData } from '../../src/lib/validation';

describe('Validation Schemas', () => {
  describe('contactFormSchema', () => {
    it('should validate valid data', () => {
      const validData = {
        fullName: 'John Doe',
        email: 'john@example.com',
        subject: 'General Enquiry',
        message: 'This is a valid message with more than 10 characters.'
      };
      const result = contactFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should fail with empty fields', () => {
      const invalidData = {
        fullName: '',
        email: '',
        subject: '',
        message: ''
      };
      const result = contactFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const formatted = result.error.format();
        expect(formatted.fullName?._errors).toContain('Enter your full name');
        expect(formatted.email?._errors).toContain('Enter your email address');
        expect(formatted.subject?._errors).toContain('Select a subject');
        expect(formatted.message?._errors).toContain('Message must be at least 10 characters');
      }
    });

    it('should fail with invalid email', () => {
      const invalidData = {
        fullName: 'John Doe',
        email: 'not-an-email',
        subject: 'Subject',
        message: 'Valid message content here.'
      };
      const result = contactFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
         expect(result.error.format().email?._errors).toContain('Enter a valid email address');
      }
    });
    
    it('should fail with short message', () => {
      const invalidData = {
          fullName: 'John Doe',
          email: 'john@example.com',
          subject: 'Subject',
          message: 'Short'
      };
      const result = contactFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
         expect(result.error.format().message?._errors).toContain('Message must be at least 10 characters');
      }
    });
  });

  describe('feedbackFormSchema', () => {
    it('should validate valid data', () => {
        const validData = {
            satisfaction: 'satisfied',
            wouldRecommend: 'yes',
            improvements: 'Some improvements'
        };
        const result = feedbackFormSchema.safeParse(validData);
        expect(result.success).toBe(true);
    });

    it('should fail with invalid enum values', () => {
        const invalidData = {
            satisfaction: 'unknown',
            wouldRecommend: 'nope',
        };
        const result = feedbackFormSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
    });
    
    it('should allow optional improvements', () => {
        const validData = {
            satisfaction: 'very-satisfied',
            wouldRecommend: 'maybe'
        };
        const result = feedbackFormSchema.safeParse(validData);
        expect(result.success).toBe(true);
    });
  });

  describe('validateFormData helper', () => {
      it('should return success true for valid data', () => {
          const validData = {
            fullName: 'John Doe',
            email: 'john@example.com',
            subject: 'Subject',
            message: 'Valid message content.'
          };
          const result = validateFormData(contactFormSchema, validData);
          expect(result.success).toBe(true);
          expect(result.data).toEqual(validData);
          expect(result.errors).toBeUndefined();
      });

      it('should return formatted errors for invalid data', () => {
        const invalidData = {
            fullName: '',
        };
        const result = validateFormData(contactFormSchema, invalidData);
        expect(result.success).toBe(false);
        expect(result.data).toBeUndefined();
        expect(result.errors).toBeDefined();
        expect(result.errors?.length).toBeGreaterThan(0);
        expect(result.errors?.[0]).toHaveProperty('field');
        expect(result.errors?.[0]).toHaveProperty('message');
      });
  });
});
