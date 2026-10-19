import { z } from "zod";

/** Shared password policy for registration and resets */
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be at most 128 characters")
  .regex(/[A-Za-z]/, "Password must include at least one letter")
  .regex(/[0-9]/, "Password must include at least one number");
