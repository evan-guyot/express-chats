import { z } from "zod";

export const createRoomSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z
    .string()
    .min(5, { message: "Description must be at least 5 characters long" })
    .nonempty({ message: "Description is required" }),
});

export const updateRoomSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z
    .string()
    .min(5, { message: "Description must be at least 5 characters long" }),
});
