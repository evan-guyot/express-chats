import { House } from "lucide-react";

function Unauthorized() {
  return (
    <div className="container flex items-center min-h-screen px-6 py-12 mx-auto">
      <div>
        <p className="text-sm font-medium text-blue-500 dark:text-blue-400">
          401 error
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-gray-800 dark:text-white md:text-3xl">
          You do not have access to this page
        </h1>
        <p className="mt-4 text-gray-500 dark:text-gray-400">
          Your token might have expired. Please authenticate again by going to the home page.
        </p>
        <div className="flex items-center mt-6 gap-x-3">
          <a
            href="/"
            className="flex items-center w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600 cursor-pointer"
          >
            <House className="mr-4" /> Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export default Unauthorized;
