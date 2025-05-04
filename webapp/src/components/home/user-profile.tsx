import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { logout, User } from "../../slices/userSlice";
import { LogOut } from "lucide-react";

function UserProfile({ user }: { user: User }) {
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
            Welcome {user.name}
          </h1>
          <div className="flex space-x-4">
            <div className="flex flex-col items-center justify-center w-40 h-40 p-4 bg-transparent border border-gray-300 rounded-lg shadow-md dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Friends
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                View your friends
              </p>
            </div>

            <a
              href="/rooms"
              className="flex flex-col items-center justify-center w-40 h-40 p-4 bg-transparent border border-gray-300 rounded-lg shadow-md dark:border-gray-700"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Rooms
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Explore chat rooms
              </p>
            </a>
          </div>

          <a
            className="flex items-center text-gray-500 dark:text-gray-400 font-medium cursor-pointer mx-auto w-fit"
            onClick={handleLogout}
          >
            <LogOut className="mr-2" /> Logout
          </a>
        </div>
      </div>
    </section>
  );
}

export default UserProfile;
