import { createContext, useContext } from "react";
import IMessage from "../../types/message";

export interface WebSocketState {
  socket: WebSocket | null;
  messages: Record<string, IMessage[]>;
}

interface WebSocketContextValue extends WebSocketState {
  startWebSocket: (token: string) => void;
  subscribeToRoom: (room: string) => void;
  sendMessage: (room: string, data: IMessage) => void;
}

export const WebSocketContext = createContext<
  WebSocketContextValue | undefined
>(undefined);

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
}
