import { Message, Prisma, PrismaClient } from "@prisma/client";

export interface AddMessageDTO {
  content: string;
  roomId: number;
}

const prisma = new PrismaClient();

class MessageModel {
  static async getAllByRoom(roomId: number): Promise<Message[]> {
    return prisma.message.findMany({
      where: { roomId: roomId },
      orderBy: { createdAt: "desc" },
    });
  }

  static async addToRoom(
    message: AddMessageDTO,
    userId: number
  ): Promise<Message | null> {
    return prisma.message.create({
      data: {
        content: message.content,
        userId: userId,
        roomId: message.roomId,
      },
    });
  }
}

export default MessageModel;
