import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import roomRoutes from "./routes/room.routes";
import authRoutes from "./routes/auth.routes";
import messageRoutes from "./routes/message.routes";
import authenticateToken from "./middlewares/auth.middleware";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(helmet());

app.use("/api/auth", authRoutes);
app.use("/api/rooms", authenticateToken, roomRoutes);
app.use("/api/messages", authenticateToken, messageRoutes);

app.listen(PORT, () => {
  console.log(`⚡ Server running on http://localhost:${PORT}`);
});
