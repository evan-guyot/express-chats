import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useEffect, useState } from "react";
import IRoom from "../types/room";
import NotFound from "./not-found";
import { isTokenExpired } from "../slices/userSlice";
import Unauthorized from "./unauthorized";
import axios from "axios";

function RoomList() {
  const user = useSelector((state: RootState) => state.user.user);
  const [rooms, setRooms] = useState<IRoom[]>();

  if (!user) {
    return <NotFound />
  }

  if (isTokenExpired(user)) {
    return <Unauthorized />
  }

  useEffect(() => {
    axios
      .get<IRoom[]>("/api/rooms/", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((response) => {
        setRooms(response.data);
      })
  }, []);

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
          Explore Chat Rooms
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms ? (
            rooms.map((room, index) => (
              <a
                key={index}
                href={`/rooms/${room.id}`}
                className="flex flex-col items-center justify-center w-full h-40 p-4 bg-transparent border border-gray-300 rounded-lg shadow-md dark:border-gray-700"
              >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {room.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {room.description}
                </p>
              </a>
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No rooms available or failed to fetch.
            </p>
          )}
        </div>
      </div>
    </div>
  </section>
  );
}

export default RoomList;
