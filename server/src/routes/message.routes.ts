import { Router } from "express";
import MessageController from "../controllers/message.controller";

const router = Router();

router.get("/", MessageController.getAllMessagesByRoom);
router.post("/", MessageController.addMessageToRoom);

export default router;
