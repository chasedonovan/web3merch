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

export type User = {
  username: string;
  pfp_profile: string;
};

export type Reward = {
  date: string;
  rewardId: string;
  name: string;
  amount: number;
  img: string;
  ada: number;
};

export type Delegation = {
  poolTicker: string;
  poolName: string;
  poolIcon: string;
  currentlyDelegatedAda: number;
  epochEndDate: string;
  currently_delegate: boolean;
  available_credits: string;
  lifetime_delegated: string;
} | null;

export type Rewards = Reward[];

type WalletContextProps = {
  isConnected: boolean;
  setConnected: (connected: boolean) => void;
  enabledWallets: Array<WalletInfo>;
  setEnabledWallets: (wallets: Array<WalletInfo>) => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  connectedWallet: WalletInfo;
  setConnectedWallet: (walletInfo: WalletInfo) => void;
  user: User;
  setUser: (user: User) => void;
  rewards: Rewards;
  setRewards: (rewards: Rewards) => void;
  delegation: Delegation;
  setDelegation: (delegation: Delegation) => void;
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
  user: {} as User,
  setUser: () => {},
  rewards: [] as Rewards,
  setRewards: () => {},
  delegation: {} as Delegation,
  setDelegation: () => {},
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
  const [user, setTheUser] = useState<User>({} as User);

  const [rewards, setTheRewards] = useState<Rewards>([] as Rewards);

  const [delegation, setTheDelegation] = useState<Delegation>({} as Delegation);

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
    getUser(walletInfo);
    getRewards(walletInfo);
    getDelegation(walletInfo);
  };

  const setUser = (user: User) => {
    setTheUser(user);
  };

  const setRewards = (rewards: Rewards) => {
    setTheRewards(rewards);
  };

  const setDelegation = (delegation: Delegation) => {
    setTheDelegation(delegation);
  };

  const getUser = (walletInfo: WalletInfo) => {
    if (walletInfo) {
      // if (walletInfo && walletInfo.stakeAddress) {
      setLoading(true);
      fetch("/api/wallet/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stakeAddress: walletInfo.stakeAddress,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setUser(data);
          setLoading(false);
          console.log("user", data);
        });
    }
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

  const getRewards = (walletInfo: WalletInfo) => {
    if (walletInfo) {
      // if (walletInfo && walletInfo.stakeAddress) {
      setLoading(true);
      fetch("/api/wallet/rewards")
        .then((res) => res.json())
        .then((data) => {
          setRewards(data);
          setLoading(false);
        });
    }
  };

  const getDelegation = (walletInfo: WalletInfo) => {
    console.log(walletInfo.stakeAddress);
    // if (walletInfo && walletInfo.stakeAddress) {
    if (walletInfo) {
      setLoading(true);
      const stakeAddress = walletInfo.stakeAddress;
      fetch("/api/wallet/delegateinfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stakeAddress: stakeAddress }),
      })
        .then((res) => res.json())
        .then((data) => {
          let delegationData: Delegation = {
            currentlyDelegatedAda: data.currentlyDelegatedAda,
            epochEndDate: data.epochEndDate,
            poolName: data.poolName,
            poolTicker: data.poolTicker,
            poolIcon: "",
            available_credits: data.available_credits,
            currently_delegate: data.currently_delegate,
            lifetime_delegated: data.lifetime_delegated,
          };

          //handle other object from backend
          if (!data.poolTicker || data.poolTicker == "") {
            let delegationData2: Delegation = {
              currentlyDelegatedAda: 0,
              epochEndDate: "",
              poolName: "",
              poolTicker: "",
              poolIcon: "",
              available_credits: "",
              currently_delegate: false,
              lifetime_delegated: "",
            };

            if (
              data.delegated_pool ==
              "pool1ps2yl6axlh5uzzst99xzkk7x0fhlmr7x033j7cmmm82x2a9n8lj"
            ) {
              delegationData2.poolName = "Unipool";
              delegationData2.poolTicker = "UNI1";
              delegationData2.currently_delegate = true;
              delegationData2.currentlyDelegatedAda =
                parseInt(data.utxo) / 1000000;
            }

            delegationData = delegationData2;
          }

          console.log("getDelegation", data, delegationData);
          setDelegation(delegationData);
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
        user,
        setUser,
        rewards,
        setRewards,
        delegation,
        setDelegation,
        validateSignedPayload,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletContext = () => useContext(WalletContext);
