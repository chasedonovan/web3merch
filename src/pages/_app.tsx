import "styles/globals.css";
import type { AppProps } from "next/app";
import { WalletContextProvider } from "../hooks/useWalletContext";
import { GlobalContextProvider } from "../hooks/useGlobalContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
      <GlobalContextProvider>
        <WalletContextProvider>
          <Component {...pageProps} />
        </WalletContextProvider>
      </GlobalContextProvider>
  );
}

export default MyApp;
