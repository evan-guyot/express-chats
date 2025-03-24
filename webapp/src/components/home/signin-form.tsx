import { useDispatch } from "react-redux";
import { login } from "../../slices/userSlice";
import { AppDispatch } from "../../store";
import { useState } from "react";
import axios from "axios";
import {
  GlobalApiError,
  isSchemaApiError,
  SchemaApiError,
} from "../../types/api/errors";
import SchemaError from "../api/schema-errors";

function SignInForm({ onChange }: { onChange: () => void }) {
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<
    GlobalApiError | SchemaApiError | undefined
  >();

  const handleSignIn = () => {
    axios
      .post("/api/auth/login", { email, password })
      .then((response) => {
        dispatch(login(response.data));
      })
      .catch(function (error) {
        if (error.response?.data?.details) {
          setAuthError(error.response.data);
        } else {
          setAuthError(error.response.data);
        }
      });
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Sign in to your account
          </h1>
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your email
            </label>
            <input
              type="text"
              name="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-gray-600 focus:border-gray-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Password
            </label>
            <input
              type="text"
              name="password"
              id="password"
              placeholder="••••••••"
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-gray-600 focus:border-gray-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {authError && isSchemaApiError(authError) && (
            <SchemaError schemaError={authError} />
          )}
          <button
            className="w-full text-white bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800 cursor-pointer"
            onClick={handleSignIn}
          >
            Sign in
          </button>
          <p className="text-sm font-light text-gray-500 dark:text-gray-400">
            Don't have an account yet ?{" "}
            <a
              className="font-medium text-gray-600 hover:underline dark:text-gray-500 cursor-pointer"
              onClick={onChange}
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignInForm;
