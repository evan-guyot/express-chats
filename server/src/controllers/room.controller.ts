import { Request, Response } from "express";
import RoomService from "../services/room.service";

class RoomController {
  static async getAllRooms(req: Request, res: Response) {
    const rooms = await RoomService.getAllRooms();
    res.json(rooms);
  }

  static async getRoomById(req: Request, res: Response) {
    const room = await RoomService.getRoomById(req.params.id);
    res.json(room);
  }

  static async createRoom(req: Request, res: Response) {
    const newRoom = await RoomService.createRoom(req.body);
    res.status(201).json(newRoom);
  }

  static async updateRoom(req: Request, res: Response) {
    const updatedRoom = await RoomService.updateRoom(req.params.id, req.body);
    res.json(updatedRoom);
  }

  static async deleteRoom(req: Request, res: Response) {
    await RoomService.deleteRoom(req.params.id);
    res.status(204).send();
  }
}

export default RoomController;
