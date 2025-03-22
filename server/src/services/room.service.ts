import RoomModel, {
  CreateRoomDTO,
  Room,
  UpdateRoomDTO,
} from "../models/room.model";

class RoomService {
  static async getAllRooms(): Promise<Room[]> {
    return RoomModel.findAll();
  }

  static async getRoomById(id: string): Promise<Room | undefined> {
    return RoomModel.findById(id);
  }

  static async createRoom(roomData: CreateRoomDTO): Promise<Room | undefined> {
    return RoomModel.create(roomData);
  }

  static async updateRoom(
    id: string,
    roomData: UpdateRoomDTO
  ): Promise<Room | undefined> {
    return RoomModel.update(id, roomData);
  }

  static async deleteRoom(id: string): Promise<void> {
    return RoomModel.delete(id);
  }
}

export default RoomService;
