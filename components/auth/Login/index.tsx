"use client";
import GoogleIcon from "@mui/icons-material/Google";
import { useAuthContext } from "../../../lib/context/authContext";
import Image from "next/image";

const Login = () => {
  const { googleLoginHandler } = useAuthContext();
  return (
    <main className="container max-w-lg p-6 mx-auto flex flex-col justify-center">
      <div>
        <h1 className="text-5xl font-bold text-center">Hello World! 👋</h1>
        <div className="mt-10 flex flex-col gap-4 bg-white shadow-2xl rounded-xl p-4 font-semibold dark:bg-slate-600">
          <h3 className="text-2xl">Sign In to your Wallet</h3>
          <button onClick={googleLoginHandler} className="btn-primary flex items-center gap-1 btn w-full justify-center">
            <GoogleIcon className="dark:text-lime-400 text-white" /> Google
          </button>
        </div>
      </div>
      <Image width={800} height={800} className="absolute bottom-0 left-0" src="/images/budget-planning.png" alt="budget-planning" />
    </main>
  );
};

export default Login;
