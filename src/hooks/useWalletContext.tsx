import {
  createContext,
  PropsWithChildren,
  useState,
  useContext,
  useEffect,
} from "react";

export type WalletInfo = {
  name: string;
  icon: string;
  provider: any;
  providerapi: any;
  address: string;
  stakeAddress: string;
  balance: number;
  backendinfo: string;
};

type WalletContextProps = {
  isConnected: boolean;
  setConnected: (connected: boolean) => void;
  enabledWallets: Array<WalletInfo>;
  setEnabledWallets: (wallets: Array<WalletInfo>) => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  connectedWallet: WalletInfo;
  setConnectedWallet: (walletInfo: WalletInfo) => void;
  validateSignedPayload: (signedPayload: string, stakeAddress: string) => void;
};

const WalletContext = createContext<WalletContextProps>({
  isConnected: false,
  setConnected: () => {},
  enabledWallets: [],
  setEnabledWallets: () => {},
  isLoading: false,
  setLoading: () => {},
  connectedWallet: {} as WalletInfo,
  setConnectedWallet: () => {},
  validateSignedPayload: () => {},
});

type ProviderProps = {} & PropsWithChildren;

export const WalletContextProvider = ({ children }: ProviderProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [enabledWallets, setTheEnabledWallets] = useState<Array<WalletInfo>>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [connectedWallet, setTheConnectedWallet] = useState<WalletInfo>(
    {} as WalletInfo
  );

  const setEnabledWallets = (wallets: Array<WalletInfo>) => {
    setTheEnabledWallets(wallets);
  };

  const setConnected = (connected: boolean) => {
    setIsConnected(connected);
  };

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const setConnectedWallet = (walletInfo: WalletInfo) => {
    setTheConnectedWallet(walletInfo);
  };

  const validateSignedPayload = (
    signedPayload: string,
    stakeAddress: string
  ) => {
    if (signedPayload) {
      console.log("validateSignedPayload");
      console.log(signedPayload);
      setLoading(true);
      fetch("/api/wallet/auth/validateauth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          signedPayload: signedPayload,
          stakeAddress: stakeAddress,
        }),
      })
        .then((res) => res.json())
        .then((response) => console.log(response))
        //todo: handle response
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        setConnected,
        enabledWallets,
        setEnabledWallets,
        isLoading,
        setLoading,
        connectedWallet,
        setConnectedWallet,
        validateSignedPayload,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletContext = () => useContext(WalletContext);
