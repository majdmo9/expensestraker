"use client";
import GoogleIcon from "@mui/icons-material/Google";
import { useAuthContext } from "../../../lib/context/authContext";
import Image from "next/image";

const Login = () => {
  const { googleLoginHandler, anonymousLoginHandler } = useAuthContext();
  return (
    <main className="container max-w-2xl p-6 mx-auto flex flex-col justify-center">
      <div>
        <h1 className="text-5xl font-bold text-center">Hello World! 👋</h1>
        <div className="py-4 w-full sm:flex-row flex-col flex mt-10 bg-white shadow-2xl rounded-xl dark:bg-slate-600">
          <Image width={250} height={250} alt="img" src="/images/money.png" className="w-full h-full hidden sm:flex" />
          <div className="w-full min-h-full flex flex-col gap-4 p-4 font-semibold">
            <h3 className="text-2xl">Sign In to your Wallet</h3>
            <button onClick={googleLoginHandler} className="btn-primary flex items-center gap-1 btn w-full justify-center">
              <GoogleIcon className="dark:text-emerald-400 text-white" /> Google
            </button>
            <button
              onClick={anonymousLoginHandler}
              className="flex items-center gap-1 text- btn w-full justify-center dark:text-emerald-400 text-black underline border-none"
            >
              Login as Guest
            </button>
          </div>
          <Image width={250} height={250} alt="img" src="/images/money.png" className="w-full h-full sm:hidden visible" />
        </div>
      </div>
    </main>
  );
};

export default Login;
