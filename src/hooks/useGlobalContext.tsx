import {
  createContext,
  PropsWithChildren,
  useState,
  useContext,
  useEffect,
} from "react";

export type ProtocolParameters = {
  min_fee_a: string;
  min_fee_b: string;
  max_tx_size: string;
  key_deposit: string;
  pool_deposit: string;
  max_val_size: string;
  coins_per_utxo_word: string;
};

type GlobalContextProps = {
  protocolParameters: ProtocolParameters;
};

const GlobalContext = createContext<GlobalContextProps>({
  protocolParameters: {} as ProtocolParameters,
});

type ProviderProps = {} & PropsWithChildren<{}>;

export const GlobalContextProvider = ({ children }: ProviderProps) => {
  const [protocolParameters, setTheProtocolParameters] =
    useState<ProtocolParameters>({} as ProtocolParameters);

  // useEffect(() => {
  //   console.log("GlobalContextProvider useEffect");
  //   getProtocolParams();
  // }, []);

  // const getProtocolParams = async () => {
  //   if (!protocolParameters || !protocolParameters.coins_per_utxo_word) {
  //     await fetch("/api/protocolparameters", {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     })
  //       .then((res) => res.json())
  //       .then((data) => {
  //         console.log("getProtocolParams", data);

  //         if (!data || !data.min_fee_a) {
  //           data = {
  //             min_fee_a: 44,
  //             min_fee_b: 155381,
  //             max_tx_size: 16384,
  //             key_deposit: "2000000",
  //             pool_deposit: "500000000",
  //             max_val_size: "5000",
  //             coins_per_utxo_word: "4310",
  //           };
  //         }
  //         setTheProtocolParameters(data as ProtocolParameters);
  //       });
  //   }
  // };

  return (
    <GlobalContext.Provider
      value={{
        protocolParameters,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
