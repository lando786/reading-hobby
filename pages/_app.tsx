import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Patrick_Hand } from "next/font/google";
import { UserProvider } from "@/contexts/UserContext";

const patrickHand = Patrick_Hand({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-patrick-hand",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={`${patrickHand.variable} font-sans`}>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </main>
  );
}
