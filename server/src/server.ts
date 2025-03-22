import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import roomRoutes from "./routes/room.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(helmet());

app.use("/rooms", roomRoutes);

app.listen(PORT, () => {
  console.log(`⚡ Server running on http://localhost:${PORT}`);
});
