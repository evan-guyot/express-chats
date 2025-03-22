import { z } from "zod";

export const registerAuthSchema = z.object({
  name: z
    .string()
    .min(4, { message: "The name must be at least 4 characters" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("This is not a valid email"),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$"), {
      message:
        "Password must contain an uppercase letter, lowercase letter, and number",
    }),
});

export const loginAuthSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("This is not a valid email"),
  password: z.string().min(1, { message: "Password is required" }),
});
