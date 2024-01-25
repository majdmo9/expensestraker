import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navigation from "@expensestracker/components/Navigation";

import "./globals.css";
import FinanceContextProvider from "../lib/context/financeContext";
import AuthContextProvider from "../lib/context/authContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Expenses Tracker",
  description: "Track your money carefuly",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.JSX.Element;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContextProvider>
          <FinanceContextProvider>
            <>
              <ToastContainer />
              <Navigation />
              {children}
            </>
          </FinanceContextProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
