import { FunctionComponent, useEffect, useState } from "react";
import { useWalletContext, WalletInfo } from "../../hooks/useWalletContext";
import CardanoWalletAPI from "../../client/CardanoWalletAPI";
import Image from "next/image";
import AlertModal from "./../AlertModal";
import NoGoatsAlertModal from "./NoGoatAlertModal";

const walletList = [
  { name: "eternl", icon: "/eternl.png", displayName: "Eternl" },
  { name: "Flint Wallet", icon: "/flint.svg", displayName: "Flint" },
  { name: "Nami", icon: "/nami.svg", displayName: "Nami" },
  //{ name: "Typhon Wallet", icon: "/typhon.svg", displayName: "Typhon" },
  //{ name: "Gero", icon: "/gero.svg", displayName: "Gero" },
  // { name: "Nufi", icon: "/nufi.svg", displayName: "Nufi" },
];

export const MerchConnectBtn: FunctionComponent = () => {
  const [showModal, setShowModal] = useState(false);
  const [noGoats, setNoGoats] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const {
    isConnected,
    setConnected,
    enabledWallets,
    setEnabledWallets,
    isLoading,
    setLoading,
    connectedWallet,
    setConnectedWallet,
    validateSignedPayload,
  } = useWalletContext();

  const handleEnabledWallets = async () => {
    await setLoading(true);
    // console.log("Wallet.handleEnabledWallets", enabledWallets);
    const wallets = await CardanoWalletAPI.getEnabledWallets();

    if (wallets) {
      // console.log("Wallets:", wallets);
      let walletInfos = wallets.map(
        (e) =>
          ({ name: e.name, icon: e.icon, provider: e.provider } as WalletInfo)
      );
      // console.log(walletInfos, "walletInfos");
      setEnabledWallets(walletInfos);
    }
    // console.log(enabledWallets), "enabledWallets2";

    setLoading(false);
  };

  const handleWalletConnect = async (name: string) => {
    setLoading(true);

    // setTimeout(async () => {
    const matchingWallet = enabledWallets.find((w) => w.name === name);

    if (matchingWallet) {
      try {
        const providerapi = await CardanoWalletAPI.enableWallet(
          matchingWallet.name
        );
        console.log(providerapi);

        if (providerapi) {
          const walletAddress = await CardanoWalletAPI.getAddress(providerapi);
          const walletBalance = await CardanoWalletAPI.getBalance(providerapi);
          const stakeAddress = await CardanoWalletAPI.getRewardAddresses(
            providerapi
          );
          console.log(walletAddress, walletBalance, stakeAddress);
          try {
            //post to goatcheck api with stake address to see if they have goats
            const res = await fetch("/api/goatcheck", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ stakeAddress: stakeAddress }),
            });

            const data = await res.json();
            console.log(data);
            if (data === true) {
              setConnectedWallet({
                name: matchingWallet.name,
                icon: matchingWallet.icon,
                provider: matchingWallet.provider,
                providerapi: providerapi,
                balance: walletBalance,
                address: walletAddress,
                stakeAddress: stakeAddress,
              } as WalletInfo);
              setConnected(true);
              setLoading(false);
              return;
            } else if (data === false) {
              setNoGoats(true);
              setLoading(false);
              return;
            }
          } catch (error) {
            console.log(error);
            // if (error === true) {
            //   setConnectedWallet({
            //     name: matchingWallet.name,
            //     icon: matchingWallet.icon,
            //     provider: matchingWallet.provider,
            //     providerapi: providerapi,
            //     balance: walletBalance,
            //     address: walletAddress,
            //     stakeAddress: stakeAddress,
            //   } as WalletInfo);
            //   setConnected(true);
            //   setLoading(false);
            //   return;
            // } else {
            //   setNoGoats(true);
            //   setLoading(false);
            //   return;
            // }
            setShowModal(true);
            setModalMessage("Error connecting to wallet");
            setLoading(false);
            return;
          }

          // let walletSignature;
          // if (name === "Nami") {
          //   walletSignature = await CardanoWalletAPI.signDataNami(providerapi);
          // } else {
          //   walletSignature = await CardanoWalletAPI.signData(providerapi);
          // }

          // console.log(walletSignature);

          // if (walletSignature) {
          //   const walletAddress = await CardanoWalletAPI.getAddress(
          //     providerapi
          //   );
          //   // console.log("Address:");
          //   // console.log(walletAddress);
          //   const walletBalance = await CardanoWalletAPI.getBalance(
          //     providerapi
          //   );
          //   // console.log("Balance:");
          //   // console.log(walletBalance);
          //   const stakeAddress = await CardanoWalletAPI.getRewardAddresses(
          //     providerapi
          //   );

          //   const isValid = validateSignedPayload(
          //     walletSignature.signature,
          //     stakeAddress ?? ""
          //   );

          //   setConnectedWallet({
          //     name: matchingWallet.name,
          //     icon: matchingWallet.icon,
          //     provider: matchingWallet.provider,
          //     providerapi: providerapi,
          //     balance: walletBalance,
          //     address: walletAddress,
          //     stakeAddress: stakeAddress,
          //   } as WalletInfo);
          //   setConnected(true);
          //   setLoading(false);
          //   return;
          // }
        }
      } catch (e: any) {
        setLoading(false);
        setShowModal(true);
        setModalMessage(e);
        console.log(e);
      }
    }
    setLoading(false);
    setShowModal(true);
    setModalMessage("Please enable your wallet and try again.");
    console.log("Error: wallet not found");
    // }, 1000);
  };

  const handleDisconnect = () => {
    setConnected(false);
    setConnectedWallet({} as WalletInfo);
  };

  useEffect(() => {
    handleEnabledWallets();
  }, []);

  return (
    <>
      {showModal && (
        <AlertModal
          message={modalMessage}
          setShowModal={setShowModal}
          showModal={showModal}
        />
      )}
      {noGoats && (
        <NoGoatsAlertModal
          message={modalMessage}
          setNoGoats={setNoGoats}
          noGoats={noGoats}
        />
      )}
      {!isLoading && (
        <div className="ml-2 w-[138px] md:w-[224px] min-h-[56px] flex flex-row border border-opacity-[.75] border-[#2C2D33]/50 rounded-lg self center h-14 self-center">
          {!isLoading && !isConnected && (
            <div className="relative group flex w-full">
              <div
                className="group w-full h-full flex justify-center bg-opacity-75 rounded-lg cursor-pointer border  border-[#2C2D33] min-h-max "
                onMouseOver={handleEnabledWallets}
              >
                <p className="self-center font-quicksand">Connect Wallet</p>
              </div>
              <div className="invisible group group-hover:visible hover:visible absolute z-40 rounded-lg h-max text-center flex flex-col text-sm  border border-[#2C2D33] divide-y divide-[#2C2D33] top-[54px] w-max bg-[#0d0d0d]">
                {/* {enabledWallets &&
              enabledWallets.map((wallet) => (
                <div
                  key={wallet.name}
                  className="cursor-pointer flex-row flex  h-[64px] hover:bg-slate-700 w-[136px] md:w-[222px]"
                  onClick={() => handleWalletConnect(wallet.name)}
                >
                  <div className="flex flex-row cursor-pointer ml-4 self-center">
                    <Image
                      src={wallet.icon}
                      width={"32px"}
                      height={"32px"}
                      className="w-12 h-12 cursor-pointer ml-4 self-center"
                      alt="wallet icon"
                    />
                  </div>
                  <p className="text-white text-sm ml-4 self-center font-quicksand">
                    {wallet.name}
                  </p>
                </div>
              ))} */}
                {walletList.map((wallet) => (
                  <div
                    key={wallet.name}
                    className="cursor-pointer flex-row flex h-[48px] hover:bg-slate-700 rounded-md w-[136px] md:w-[222px]"
                    onClick={() => handleWalletConnect(wallet.name)}
                  >
                    <div className="flex flex-row cursor-pointer ml-4 self-center">
                      <Image
                        src={wallet.icon}
                        width={"32px"}
                        height={"32px"}
                        className="w-10 h-10 cursor-pointer ml-4 self-center"
                        alt="wallet icon"
                      />
                    </div>
                    <p className="text-white text-sm ml-4 self-center font-quicksand">
                      {wallet.displayName}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {!isLoading && isConnected && (
            <div className="relative group h-full w-full ">
              <div className="group h-full flex flex-row w-full justify-between">
                <div className="group self-center flex flex-col items-center justify-center h-full rounded-lg">
                  <img
                    className="ml-4 h-10 w-10 self-center cursor-pointer group"
                    src={connectedWallet.icon}
                    alt="wallet icon"
                  />
                </div>
                <div className="group self-center flex flex-col items-center justify-center h-full rounded-lg w-full">
                  <p className="hidden md:flex self-center md:min-w-[98px] pl-2  ">
                    {connectedWallet.balance
                      ? `${connectedWallet.balance.toFixed(2)} ADA`
                      : 0.0}
                  </p>
                  <p className="md:hidden self-center md:min-w-[98px] pl-2  ">
                    {connectedWallet.balance
                      ? `${Math.floor(connectedWallet.balance)} ADA`
                      : 0.0}
                  </p>
                </div>
              </div>
              <div className="invisible group group-hover:visible hover:visible absolute z-40 rounded-md h-max text-center flex flex-col text-sm  border border-[#2C2D33] divide-y divide-[#2C2D33] top-[54px] w-max bg-[#0d0d0d]">
                {/* {enabledWallets &&
              enabledWallets.map((wallet) => (
                <div
                  key={wallet.name}
                  className="cursor-pointer flex-row flex  h-[64px] hover:bg-slate-700 w-[136px] md:w-[222px]"
                  onClick={() => handleWalletConnect(wallet.name)}
                >
                  <div className="flex flex-row cursor-pointer ml-4 self-center">
                    <Image
                      src={wallet.icon}
                      width={"32px"}
                      height={"32px"}
                      className="w-12 h-12 cursor-pointer ml-4 self-center"
                      alt="wallet icon"
                    />
                  </div>
                  <p className="text-white text-sm ml-4 self-center font-quicksand">
                    {wallet.name}
                  </p>
                </div>
              ))} */}
                {walletList.map((wallet) => (
                  <div
                    key={wallet.name}
                    className={`cursor-pointer flex-row flex h-[48px] hover:bg-slate-700 rounded-md w-[136px] md:w-[222px] ${
                      wallet.name === connectedWallet.name &&
                      "bg-gray-400 bg-opacity-20"
                    } `}
                    onClick={() => handleWalletConnect(wallet.name)}
                  >
                    <div className="flex flex-row cursor-pointer ml-4 self-center min-w-max">
                      <Image
                        src={wallet.icon}
                        width={"32px"}
                        height={"32px"}
                        className="w-12 h-12 cursor-pointer ml-4 self-center"
                        alt="wallet icon"
                      />
                    </div>
                    <p className="text-white text-sm ml-4 self-center font-quicksand flex justify-between w-full mr-4">
                      {wallet.name === connectedWallet.name
                        ? `${connectedWallet.balance.toFixed(2)} ADA`
                        : wallet.displayName}
                      {wallet.name === connectedWallet.name && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="green"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                      )}
                    </p>
                  </div>
                ))}
                <div
                  className="cursor-pointer flex-row flex h-[48px] hover:bg-slate-700 rounded-md w-[136px] md:w-[222px]"
                  onClick={handleDisconnect}
                >
                  <div className="flex flex-row cursor-pointer ml-4 self-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="gray"
                      className="w-8 h-8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-400 text-sm ml-3 self-center font-quicksand">
                    Disconnect
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {isLoading && (
        <div className="ml-2 w-[138px] md:w-[224px] flex flex-row border border-opacity-[.75] border-[#2C2D33] rounded-lg self center divide-x divide-[#2C2D33] justify-center h-14 self-center">
          <div className="min-w-[48px] flex-col mx-2 self-center">
            <img className="h-7 w-11 self-center" src="./loading.svg" />
          </div>
        </div>
      )}

      {isConnected && enabledWallets && enabledWallets.length === 0 && (
        <div className="flex w-full">
          <p>
            No wallets found, please enable your wallet. Currently supported
            wallets are: Nami, Eternl, Flint and Gero
          </p>
        </div>
      )}
    </>
  );
};
