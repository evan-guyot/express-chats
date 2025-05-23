import { useState } from "react";
import SignInForm from "../components/home/signin-form";
import SignUpForm from "../components/home/signup-form";
import { RootState } from "../store";
import { useSelector } from "react-redux";
import UserProfile from "../components/home/user-profile";
import { isTokenExpired } from "../slices/userSlice";
import { useWebSocket } from "../contexts/webSocket/useWebSocket";

function Home() {
  const [signIn, setSignIn] = useState<boolean>(false);
  const user = useSelector((state: RootState) => state.user.user);
  const { startWebSocket } = useWebSocket();

  if (user && !isTokenExpired(user)) {
    startWebSocket(user.token);
    return <UserProfile user={user} />;
  }

  const changeForm = () => {
    setSignIn(!signIn);
  };

  return (
    <section className="bg-white dark:bg-gray-900 ">
      {signIn ? (
        <SignUpForm onChange={changeForm} />
      ) : (
        <SignInForm onChange={changeForm} />
      )}
    </section>
  );
}

export default Home;
