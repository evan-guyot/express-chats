import RoomModel, {
  CreateRoomDTO,
  Room,
  UpdateRoomDTO,
} from "../models/room.model";

class RoomService {
  static async getAllRooms(): Promise<Room[]> {
    return RoomModel.findAll();
  }

  static async getRoomById(id: number): Promise<Room | null> {
    return RoomModel.findById(id);
  }

  static async createRoom(roomData: CreateRoomDTO): Promise<Room | undefined> {
    return RoomModel.create(roomData);
  }

  static async updateRoom(
    id: number,
    roomData: UpdateRoomDTO
  ): Promise<Room | null> {
    return RoomModel.update(id, roomData);
  }

  static async deleteRoom(id: number): Promise<boolean> {
    return RoomModel.delete(id);
  }
}

export default RoomService;
