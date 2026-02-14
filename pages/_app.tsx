import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Patrick_Hand } from "next/font/google";
import { UserProvider } from "@/contexts/UserContext";

import { SessionProvider } from "next-auth/react";

const patrickHand = Patrick_Hand({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-patrick-hand",
});

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <main className={`${patrickHand.variable} font-sans`}>
        <UserProvider>
          <Component {...pageProps} />
        </UserProvider>
      </main>
    </SessionProvider>
  );
}
