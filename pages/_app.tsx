import { UserContextProvider } from "@/context/user_context";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import Head from "next/head";
import type { AppProps } from "next/app";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session} refetchInterval={0}>
      <UserContextProvider>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <main className={inter.className}>
          <Component {...pageProps} />
        </main>
      </UserContextProvider>
    </SessionProvider>
  );
}
