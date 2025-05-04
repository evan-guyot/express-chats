import { Message, User } from "@prisma/client";
import MessageModel, { AddMessageDTO } from "../models/message.model";
import WebSocketService from "./websocket.service";
import UserService from "./user.service";

class MessageService {
  static async getAllByRoom(
    roomId: number
  ): Promise<(Message & { userName: string | null })[]> {
    const messages = await MessageModel.getAllByRoom(roomId);

    const userIds = [...new Set(messages.map((m) => m.userId))];

    const users = await Promise.all(
      userIds.map((id) => UserService.getUserById(id))
    );

    const userMap = new Map<number, User | null>();
    userIds.forEach((id, index) => userMap.set(id, users[index]));

    return messages.map((message) => {
      const user = userMap.get(message.userId);
      return {
        ...message,
        userName: user?.name ?? null,
      };
    });
  }

  static async addToRoom(
    messageDto: AddMessageDTO,
    userId: number
  ): Promise<Message | null> {
    const webSocketService = WebSocketService.getInstance();
    try {
      const message = await MessageModel.addToRoom(messageDto, userId);

      if (!message) return null;

      const user = await UserService.getUserById(userId);

      if (!user) return null;

      webSocketService.broadcastToRoom(`room_${message.roomId}`, {
        ...message,
        userName: user.name,
      });

      return message;
    } catch (error) {
      return null;
    }
  }
}

export default MessageService;
