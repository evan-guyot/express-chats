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
import { Send } from "lucide-react";  
import IMessage from "../types/message";

function Room() {
  const { id } = useParams()
  const user = useSelector((state: RootState) => state.user.user);
  const [room, setRoom] = useState<IRoom>();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");

  if (!user) {
    return <NotFound />
  }

  if (isTokenExpired(user)) {
    return <Unauthorized />
  }

  useEffect(() => {
    axios
      .get<IRoom>(`/api/rooms/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((response) => {
        setRoom(response.data);
      })
  }, [id]);

  if (!room) {
    return <RoomNotFound />
  }


  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const message: IMessage = {
      id: crypto.randomUUID(),
      content: newMessage,
      userId: user.id,
      userName: user.name,
      roomId: room.id,
      createdAt: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, message]);
    setNewMessage("");
  };

  return (
    <section className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <header className="p-4 bg-white dark:bg-gray-800 shadow-md m-4 rounded-lg">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white text-center">
          {room ? room.name : "Loading..."}
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.userId === user.id ? "justify-end" : "justify-start"
                }`}
            >
              <div
                className={`min-w-[100px] max-w-[75%] p-3 rounded-lg shadow-md ${message.userId === user.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
                  }`}
              >
                <p className="text-sm font-semibold mb-1">
                  {message.userId === user.id ? "You" : message.userName}
                </p>
                <p>{message.content}</p>
                <p className="text-xs text-gray-300 dark:text-gray-500 mt-1 text-right">
                  {new Date(message.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No messages yet. Start the conversation!
          </p>
        )}
      </div>

      <footer className="p-4 bg-white dark:bg-gray-800 shadow-md m-4 rounded-lg">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            className="flex-1 px-6 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-700 dark:text-white"
            placeholder="Message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={handleSendMessage}
          >
            <Send className="w-5 h-5 m-auto" />
          </button>
        </div>
      </footer>
    </section>
  );
}

export default Room;
