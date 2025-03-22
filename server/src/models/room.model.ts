export interface Room {
  id: string;
  name: string;
  createdAt: Date;
}

export interface CreateRoomDTO {
  name: string;
}

export interface UpdateRoomDTO {
  name: string;
}

let rooms: Room[] = []; // In-memory database

class RoomModel {
  static async findAll(): Promise<Room[]> {
    return rooms;
  }

  static async findById(id: string): Promise<Room | undefined> {
    return rooms.find((room) => room.id === id);
  }

  static async create(roomData: CreateRoomDTO): Promise<Room> {
    const newRoom: Room = {
      id: String(Date.now()),
      ...roomData,
      createdAt: new Date(),
    };
    rooms.push(newRoom);
    return newRoom;
  }

  static async update(
    id: string,
    roomData: Partial<UpdateRoomDTO>
  ): Promise<Room | undefined> {
    const index = rooms.findIndex((room) => room.id === id);
    if (index !== -1) {
      rooms[index] = { ...rooms[index], ...roomData };
      return rooms[index];
    }
    return undefined;
  }

  static async delete(id: string): Promise<void> {
    rooms = rooms.filter((room) => room.id !== id);
  }
}

export default RoomModel;
