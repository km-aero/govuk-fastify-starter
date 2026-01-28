/**
 * Zod Validation Schemas
 * =======================
 * Centralized validation schemas for form data.
 * These schemas are used both client-side and server-side to ensure
 * consistent validation across the application.
 */

import { z } from "zod";

// =============================================================================
// CONTACT FORM SCHEMA
// =============================================================================

/**
 * Schema for contact form validation.
 * Validates full name, email, subject, and message fields.
 */
export const contactFormSchema = z.object({
  fullName: z
    .string()
    .min(1, { message: "Enter your full name" })
    .max(200, { message: "Full name must be 200 characters or less" }),

  email: z
    .email({ message: "Enter a valid email address" })
    .min(1, { message: "Enter your email address" }),

  subject: z.string().min(1, { message: "Select a subject" }),

  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters" })
    .max(2000, { message: "Message must be 2000 characters or less" }),
});

/**
 * TypeScript type inferred from the contact form schema.
 */
export type ContactFormData = z.infer<typeof contactFormSchema>;

// =============================================================================
// FEEDBACK FORM SCHEMA
// =============================================================================

/**
 * Schema for feedback form validation.
 * Validates satisfaction rating and optional improvement suggestions.
 */
export const feedbackFormSchema = z.object({
  satisfaction: z.enum(
    [
      "very-satisfied",
      "satisfied",
      "neutral",
      "dissatisfied",
      "very-dissatisfied",
    ] as const,
    {
      message: "Select how satisfied you are",
    },
  ),

  improvements: z
    .string()
    .max(2000, { message: "Suggestions must be 2000 characters or less" })
    .optional(),

  wouldRecommend: z.enum(["yes", "no", "maybe"] as const, {
    message: "Select whether you would recommend this service",
  }),
});

/**
 * TypeScript type inferred from the feedback form schema.
 */
export type FeedbackFormData = z.infer<typeof feedbackFormSchema>;

// =============================================================================
// VALIDATION HELPERS
// =============================================================================

/**
 * Parses form data using a Zod schema and returns a standardized result.
 * Formats errors in a GDS-friendly structure for display.
 *
 * @param schema - Zod schema to validate against
 * @param data - Form data to validate
 * @returns Object with success status, data (if valid), or errors (if invalid)
 */
export function validateFormData<T extends z.ZodSchema>(
  schema: T,
  data: unknown,
): {
  success: boolean;
  data?: z.infer<T>;
  errors?: Array<{ field: string; message: string }>;
} {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  // Format errors for GDS error summary
  const errors = result.error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));

  return { success: false, errors };
}
