import { Request, Response, RequestHandler } from "express";
import MessageService from "../services/message.service";
import { addMessageToRoomSchema } from "../schemas/message.schema";
import { z } from "zod";
import AuthService from "../services/auth.service";

class MessageController {
  static getAllMessagesByRoom: RequestHandler = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const roomId = parseInt(req.query.room_id as string, 10);

    if (isNaN(roomId)) {
      res.status(400).json({ error: "Please provide a room_id" });
      return;
    }
    try {
      const messages = await MessageService.getAllByRoom(roomId);
      res.json(messages);
    } catch (error) {
      res.status(404).json({
        error: `We were unable to find messages for the room : ${roomId}`,
      });
      return;
    }
  };

  static addMessageToRoom: RequestHandler = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const validatedData = addMessageToRoomSchema.parse(req.body);
      const userInfos = await AuthService.getTokenInfos(
        req.headers.authorization?.split(" ")[1]
      );

      if (!userInfos) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const newMessage = await MessageService.addToRoom(
        validatedData,
        userInfos.id
      );
      res.status(201).json(newMessage);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res
          .status(400)
          .json({ error: "Wrong data format sent", details: error.errors });
        return;
      }
      res.status(500).json({ error: "Internal server error" });
    }
  };
}

export default MessageController;
