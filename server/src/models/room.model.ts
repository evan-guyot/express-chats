import { PrismaClient } from "@prisma/client";

export interface Room {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRoomDTO {
  name: string;
  description: string;
}

export interface UpdateRoomDTO {
  name: string;
  description: string;
}

const prisma = new PrismaClient();

class RoomModel {
  static async findAll(): Promise<Room[]> {
    return prisma.room.findMany();
  }

  static async findById(id: number): Promise<Room | null> {
    return prisma.room.findUnique({
      where: { id: id },
    });
  }

  static async create(roomData: CreateRoomDTO): Promise<Room> {
    return prisma.room.create({
      data: roomData,
    });
  }

  static async update(
    id: number,
    roomData: Partial<UpdateRoomDTO>
  ): Promise<Room | null> {
    return prisma.room.update({
      where: { id: id },
      data: roomData,
    });
  }

  static async delete(id: number): Promise<boolean> {
    try {
      const room = await prisma.room.delete({
        where: { id: id },
      });
      return room !== null;
    } catch (error) {
      return false;
    }
  }
}

export default RoomModel;
