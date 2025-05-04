import { z } from "zod";

export const addMessageToRoomSchema = z.object({
  roomId: z
    .number({ invalid_type_error: "Room ID must be a number" })
    .int({ message: "Room ID must be an integer" }),
  content: z
    .string()
    .nonempty({ message: "Content is required" }),
});
