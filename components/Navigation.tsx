"use client";
import Image from "next/image";
import LeaderboardRoundedIcon from "@mui/icons-material/LeaderboardRounded";
import { useAuthContext } from "../lib/context/authContext";
import { scrollToBottom } from "@expensestracker/utils/scrollToBottom";

const Navigation = () => {
  const { user, logout, loading } = useAuthContext();
  return (
    <header className="container max-w-2xl p-6 mx-auto">
      {user && !loading ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-[40px] w-[40px] rounded-[50%] bg-white overflow-hidden  border border-lime-400">
              <Image src={user.photoURL as string} width={40} height={40} alt={user.displayName as string} className="object-cover h-full w-full" />
            </div>
            <small>Hi, {user.displayName}!</small>
          </div>
          <nav className="flex items-center gap-4">
            <button onClick={scrollToBottom}>
              <LeaderboardRoundedIcon fontSize="large" />
            </button>
            <div>
              <button className="btn btn-danger" onClick={logout}>
                Sign out
              </button>
            </div>
          </nav>
        </div>
      ) : (
        <></>
      )}
    </header>
  );
};

export default Navigation;
