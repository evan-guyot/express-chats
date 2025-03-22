import { Request, Response, RequestHandler } from "express";
import RoomService from "../services/room.service";
import { createRoomSchema, updateRoomSchema } from "../schemas/room.schema";
import { z } from "zod";

class RoomController {
  static getAllRooms: RequestHandler = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const rooms = await RoomService.getAllRooms();
    res.json(rooms);
  };

  static getRoomById: RequestHandler = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID format" });
      return;
    }

    const room = await RoomService.getRoomById(id);

    if (!room) {
      res.status(404).json({ error: "Room not found" });
      return;
    }

    res.json(room);
  };

  static createRoom: RequestHandler = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const validatedData = createRoomSchema.parse(req.body);
      const newRoom = await RoomService.createRoom(validatedData);
      res.status(201).json(newRoom);
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

  static updateRoom: RequestHandler = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const id = parseInt(req.params.id, 10);

    try {
      const validatedData = updateRoomSchema.parse(req.body);
      const updatedRoom = await RoomService.updateRoom(id, validatedData);

      if (!updatedRoom) {
        res.status(404).json({ error: "Room not found" });
        return;
      }

      res.json(updatedRoom);
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

  static deleteRoom: RequestHandler = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID format" });
      return;
    }

    const deletedRoom = await RoomService.deleteRoom(id);

    if (deletedRoom) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Room not found" });
    }
  };
}

export default RoomController;
