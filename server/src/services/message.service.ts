import { Message } from "@prisma/client";
import MessageModel, { AddMessageDTO } from "../models/message.model";
import WebSocketService from "./websocket.service";

class MessageService {
  static async getAllByRoom(roomId: number): Promise<Message[]> {
    return MessageModel.getAllByRoom(roomId);
  }

  static async addToRoom(
    messageDto: AddMessageDTO,
    userId: number
  ): Promise<Message | null> {
    const webSocketService = WebSocketService.getInstance();
    try {
      const message = await MessageModel.addToRoom(messageDto, userId);

      if (!message) return null;

      webSocketService.broadcastToRoom(`room_${message.roomId}`, message);

      return message;
    } catch (error) {
      return null;
    }
  }
}

export default MessageService;
