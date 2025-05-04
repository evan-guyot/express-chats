import { useParams } from "react-router-dom";
import IRoom from "../types/room";
import { useEffect, useState } from "react";
import axios from "axios";
import RoomNotFound from "../components/room/notFound";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import NotFound from "./not-found";
import { isTokenExpired } from "../slices/userSlice";
import Unauthorized from "./unauthorized";
import { ArrowLeft, ArrowUp } from "lucide-react";
import IMessage from "../types/message";
import { useWebSocket } from "../contexts/webSocket/useWebSocket";

function Room() {
  const { id } = useParams();
  const user = useSelector((state: RootState) => state.user.user);
  const { subscribeToRoom } = useWebSocket();
  const [room, setRoom] = useState<IRoom>();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const { messages: wsMessages } = useWebSocket();

  useEffect(() => {
    if (!user || isTokenExpired(user)) return;

    axios
      .get<IRoom>(`/api/rooms/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((response) => {
        setRoom(response.data);
        subscribeToRoom(`room_${response.data.id}`);
      });
  }, [id, user, subscribeToRoom]);

  useEffect(() => {
    if (!user || isTokenExpired(user) || !room) return;

    axios
      .get<IMessage[]>(`/api/messages?room_id=${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((response) => {
        setMessages(response.data);
      });
  }, [id, user, room]);

  useEffect(() => {
    if (!room) return;

    const incoming = wsMessages[`room_${room.id}`] || [];

    if (incoming.length > 0) {
      setMessages((prev) => {
        const existingIds = new Set(prev.map((msg) => msg.id));
        const newMessages = incoming.filter((msg) => !existingIds.has(msg.id));
        return [...newMessages, ...prev];
      });
    }
  }, [wsMessages, room]);

  if (!user) {
    return <NotFound />;
  }

  if (isTokenExpired(user)) {
    return <Unauthorized />;
  }

  if (!room) {
    return <RoomNotFound />;
  }

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    axios
      .post(
        "/api/messages",
        { content: newMessage, roomId: room.id },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then(() => {
        setNewMessage("");
      });
  };

  return (
    <section className="flex flex-col h-screen bg-[#f9fafb] dark:bg-gray-900">
      <header className="sticky top-0 z-20 mx-4 mt-4 mb-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center gap-4">
        <a href="/rooms" className="flex items-center space-x-2">
          <ArrowLeft className="w-5 h-5 text-gray-900 dark:text-white" />
        </a>
        <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
          {room ? room.name : "Loading..."}
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        {messages.length > 0 ? (
          messages.map((message) => {
            const isOwn = message.userId === user.id;
            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`relative min-w-[15%] max-w-[75%] px-5 py-3 rounded-2xl border border-gray-200 dark:border-gray-700
                  ${
                    isOwn
                      ? "bg-purple-100 dark:bg-purple-200 text-black rounded-tr-none"
                      : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-tl-none"
                  }`}
                >
                  <div className="text-sm font-semibold mb-1">
                    {isOwn ? "You" : message.userName || "Unknown"}
                  </div>
                  <div className="text-base leading-snug">
                    {message.content}
                  </div>
                  <div className="text-xs text-right text-gray-400 mt-1">
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No messages yet. Start the conversation!
          </p>
        )}
      </div>

      <footer className="sticky bottom-0 px-6 py-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            className="flex-1 px-5 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message…"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <button
            onClick={handleSendMessage}
            className="bg-purple-100 hover:bg-purple-200 dark:bg-purple-200 dark:hover:bg-purple-100 text-white p-3 rounded-full transition"
          >
            <ArrowUp
              className="w-5 h-5 text-black antialiased"
              strokeWidth={1.5}
            />
          </button>
        </div>
      </footer>
    </section>
  );
}

export default Room;
