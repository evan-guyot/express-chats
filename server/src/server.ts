import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import http from "http";
import roomRoutes from "./routes/room.routes";
import authRoutes from "./routes/auth.routes";
import messageRoutes from "./routes/message.routes";
import authenticateToken from "./middlewares/auth.middleware";
import WebSocketService from "./services/websocket.service";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const webSocketService = WebSocketService.getInstance();

app.use(express.json());
app.use(cors());
app.use(helmet());

webSocketService.connect(server);

app.use("/api/auth", authRoutes);
app.use("/api/rooms", authenticateToken, roomRoutes);
app.use("/api/messages", authenticateToken, messageRoutes);

server.listen(PORT, () => {
  console.log(`⚡ Server running on http://localhost:${PORT}`);
  console.log(`🌐 WebSocket server running on ws://localhost:${PORT}`);
});
