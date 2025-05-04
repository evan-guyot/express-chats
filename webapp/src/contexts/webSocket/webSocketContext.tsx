import React, { useEffect, useReducer, useCallback, useRef } from "react";
import { WebSocketContext, WebSocketState } from "./useWebSocket";
import IMessage from "../../types/message";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

type WebSocketAction =
  | { type: "SET_SOCKET"; payload: WebSocket }
  | { type: "ADD_MESSAGE"; room: string; message: IMessage }
  | { type: "RESET" };

export default function WebSocketProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = useSelector((state: RootState) => state.user.user);
  const [state, dispatch] = useReducer(
    (prevState: WebSocketState, action: WebSocketAction): WebSocketState => {
      switch (action.type) {
        case "SET_SOCKET":
          return { ...prevState, socket: action.payload };
        case "ADD_MESSAGE":
          return {
            ...prevState,
            messages: {
              ...prevState.messages,
              [action.room]: [
                ...(prevState.messages[action.room] || []),
                action.message,
              ],
            },
          };
        case "RESET":
          return { socket: null, messages: {} };
        default:
          return prevState;
      }
    },
    { socket: null, messages: {} }
  );

  const socketRef = useRef<WebSocket | null>(null);

  const startWebSocket = useCallback((token: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      console.warn("WebSocket already connected.");
      return;
    }

    console.log("Starting WebSocket connection...");

    const wsUrl = import.meta.env.VITE_WS_URL || "ws://localhost:5000";
    const socket = new WebSocket(`${wsUrl}?token=${token}`);
    socketRef.current = socket;

    socket.onopen = () => {
      dispatch({ type: "SET_SOCKET", payload: socket });
    };

    socket.onmessage = (event) => {
      try {
        const { room, data } = JSON.parse(event.data);
        if (room && data) {
          dispatch({ type: "ADD_MESSAGE", room, message: data });
        }
      } catch (err) {
        console.error("WebSocket message error:", err);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket Disconnected");
      socketRef.current = null;
      dispatch({ type: "RESET" });
    };

    socket.onerror = (err) => {
      console.error("WebSocket Error:", err);
    };
  }, []);

  const sendMessage = (room: string, data: unknown) => {
    if (!user) {
      console.warn("User not authenticated. Cannot send message.");
      return;
    }

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ room, data }));
    } else {
      startWebSocket(user.token);
    }
  };

  const subscribeToRoom = (room: string) => {
    if (!user) {
      console.warn("User not authenticated. Cannot subscribe to a room.");
      return;
    }

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: "subscribe", room }));
    } else {
      startWebSocket(user.token);
    }
  };

  useEffect(() => {
    return () => {
      socketRef.current?.close();
      dispatch({ type: "RESET" });
    };
  }, []);

  const value = {
    ...state,
    startWebSocket,
    sendMessage,
    subscribeToRoom,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}
