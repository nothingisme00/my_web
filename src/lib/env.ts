/**
 * Environment Variable Validation
 * Validates all required environment variables at application startup
 * Fails fast if any critical variables are missing
 */

import { z } from "zod";

// Define environment variable schema
const envSchema = z.object({
  // Node Environment
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  // Database
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  DIRECT_URL: z.string().optional(), // Optional: for Supabase direct connection (migrations)

  // Site Configuration
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .url("NEXT_PUBLIC_SITE_URL must be a valid URL"),

  // Authentication
  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET must be at least 32 characters for security"),
  JWT_EXPIRATION: z.string().default("7d"),

  // Email Service (Resend) - Optional for initial deployment
  RESEND_API_KEY: z.string().optional(),
  CONTACT_EMAIL: z.string().email().optional(),

  // reCAPTCHA - Optional for initial deployment
  NEXT_PUBLIC_RECAPTCHA_SITE_KEY: z.string().optional(),
  RECAPTCHA_SECRET_KEY: z.string().optional(),

  // Admin Credentials (for database seed)
  ADMIN_EMAIL: z.string().email("ADMIN_EMAIL must be a valid email").optional(),
  ADMIN_PASSWORD: z
    .string()
    .min(8, "ADMIN_PASSWORD must be at least 8 characters")
    .optional(),

  // Optional: Analytics
  NEXT_PUBLIC_GA_ID: z.string().optional(),

  // Optional: Error Monitoring
  SENTRY_DSN: z.string().url().optional(),
});

// Export type for TypeScript
export type Env = z.infer<typeof envSchema>;

/**
 * Validate environment variables
 * Call this at application startup to ensure all required vars are present
 */
export function validateEnv(): Env {
  try {
    const env = envSchema.parse(process.env);
    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues.map((err) => {
        const path = err.path.join(".");
        return `  - ${path}: ${err.message}`;
      });

      console.error("❌ Environment Variable Validation Failed!\n");
      console.error("Missing or invalid environment variables:\n");
      console.error(missingVars.join("\n"));
      console.error(
        "\n💡 Check your .env file and compare with .env.example\n"
      );

      // Exit process in production to prevent running with invalid config
      if (process.env.NODE_ENV === "production") {
        console.error(
          "🛑 Exiting process due to invalid environment configuration"
        );
        process.exit(1);
      } else {
        console.warn(
          "⚠️  Continuing in development mode with missing vars (may cause errors)"
        );
      }
    }

    throw error;
  }
}

/**
 * Get a validated environment variable
 * Use this instead of process.env.X to ensure type safety
 */
export function getEnv(): Env {
  return validateEnv();
}

// Validate on module load (fail fast)
if (typeof window === "undefined") {
  // Only validate on server-side
  try {
    validateEnv();
    console.log("✅ Environment variables validated successfully");
  } catch {
    // Error already logged by validateEnv
  }
}
