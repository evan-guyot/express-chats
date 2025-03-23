import { useState } from "react";
import SignInForm from "../components/home/signin-form";
import SignUpForm from "../components/home/signup-form";
import { RootState } from "../store";
import { useSelector } from "react-redux";
import UserProfile from "../components/home/user-profile";

function Home() {
  const [signIn, setSignIn] = useState<boolean>(false);
  const user = useSelector((state: RootState) => state.user.user);

  if (user) {
    return <UserProfile user={user} />;
  }

  const changeForm = () => {
    setSignIn(!signIn);
  };

  return (
    <section className="bg-white dark:bg-gray-900 ">
      {signIn ? (
        <SignInForm onChange={changeForm} />
      ) : (
        <SignUpForm onChange={changeForm} />
      )}
    </section>
  );
}

export default Home;
