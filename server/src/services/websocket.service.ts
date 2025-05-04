import WebSocket from "ws";
import http from "http";
import jwt from "jsonwebtoken";

interface WebSocketClient {
  id: string;
  socket: WebSocket;
  rooms: Set<string>;
}

interface Message {
  type: "subscribe" | "unsubscribe";
  room: string;
}

class WebSocketService {
  private static instance: WebSocketService;
  private clients: Map<string, WebSocketClient>;

  private constructor() {
    this.clients = new Map();
  }

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  public connect(server: http.Server): void {
    const wss = new WebSocket.Server({ server });

    wss.on("connection", (socket, request) => {
      const url = new URL(request.url!, `http://${request.headers.host}`);
      const token = url.searchParams.get("token");

      if (!token) {
        socket.close(1008, "Missing auth token");
        return;
      }

      let clientId: string;

      try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as {
          id: number;
          email: string;
          [key: string]: unknown;
        };

        clientId = decodedToken.id.toString();
      } catch (err) {
        socket.close(1008, "Invalid auth token");
        return;
      }

      console.log("New WebSocket connection established");
      const client: WebSocketClient = {
        id: clientId,
        socket,
        rooms: new Set(),
      };

      this.clients.set(clientId, client);

      socket.on("message", (message) => {
        console.log("Received message:", message.toString());

        const data: Message = JSON.parse(message.toString());
        if (data.type === "subscribe") {
          this.subscribe(clientId, data.room);
        } else if (data.type === "unsubscribe") {
          this.unsubscribe(clientId, data.room);
        }
      });

      socket.on("close", () => {
        console.log("WebSocket connection closed");

        this.clients.delete(clientId);
      });

      socket.on("error", (err) => {
        console.error("WebSocket error:", err);
      });
    });
  }

  public subscribe(clientId: string, room: string): void {
    const client = this.clients.get(clientId);
    if (client) {
      client.rooms.add(room);
    }
  }

  public unsubscribe(clientId: string, room: string): void {
    const client = this.clients.get(clientId);
    if (client) {
      client.rooms.delete(room);
    }
  }

  public broadcastToRoom(room: string, data: any): void {
    this.clients.forEach((client) => {
      if (client.rooms.has(room)) {
        client.socket.send(JSON.stringify({ room, data }));
      }
    });
  }
}

export default WebSocketService;
