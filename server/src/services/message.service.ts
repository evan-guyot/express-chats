import { Message } from "@prisma/client";
import MessageModel, { AddMessageDTO } from "../models/message.model";

class MessageService {
    static async getAllByRoom(roomId: number): Promise<Message[]> {
        return MessageModel.getAllByRoom(roomId);
    }

    static async addToRoom(messageDto: AddMessageDTO, userId: number): Promise<Message | null> {
        try{
             const message = MessageModel.addToRoom(messageDto, userId);

             // TODO: send message by websocket

             return message;
        }
        catch(error){
            return null;
        }
    }
}

export default MessageService;
