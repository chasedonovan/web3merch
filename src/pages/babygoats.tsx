import React, { useEffect } from "react";
import Head from "next/head";

type Props = {};

const Babygoats = (props: Props) => {
  const [stakeAddy, setStakeAddy] = React.useState<string>("");
  const [err, setErr] = React.useState<boolean>(false);
  const [checkLoading, setCheckLoading] = React.useState<boolean>(false);
  const [whitelisted, setWhitelisted] = React.useState<boolean>(false);
  const [whitelistedAmount, setWhitelistedAmount] = React.useState<number>(0);
  const [badMsg, setBadMsg] = React.useState<string>("");

  const copy = async () => {
    await navigator.clipboard.writeText('addr1v9q54r6t0xdeftuyysjq88hmf8esqsqmrahu5gdtm8634zcr79uh3');
    alert("Address copied. Send 2 ADA to this address to claim a Baby Goat!");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (stakeAddy.length > 1) {
      setErr(false);
      setCheckLoading(true);

      try {
        const res = await fetch("/api/babygoat", {
          body: JSON.stringify({
            stakeAddy,
          }),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        });
        const result = await res.json();
        if (result.whitelisted === true) {
          setCheckLoading(false);
          setWhitelisted(true);
          setWhitelistedAmount(result.whitelisted_amount);
        } else if (result.invalid) {
          setCheckLoading(false);
          setBadMsg(result.invalid);
          setCheckLoading(false);
        } else {
          setCheckLoading(false);
          console.log(result);
        }
      } catch (e) {
        console.log(e);
        setCheckLoading(false);
      }
    } else {
      setErr(true);
    }
  };

  useEffect(() => {
    if (stakeAddy.length > 1) {
      setErr(false);
    }
  }, [stakeAddy]);

  return (
    <>
      <Head>
        <title>GoatTribe | BabyGoats</title>
        <meta name="description" content="The only place to claim a babygoat" />
        <link rel="icon" href="/merch/6-sticker7.png" />
      </Head>
      <div className="w-full h-full p-2 flex flex-col justify-center items-center overflow-auto scrollbar-hide">
        <div className=" w-full md:w-max rounded-lg border border-white bg-white bg-opacity-80 p-16 pt-12">
          <div className="text-center text-3xl text-black font-bold mb-2">
            Goat Tribe - Baby Goats
          </div>
          {!whitelisted && (
          <p className="text-gray-600 text-center">
            Enter stake address to check eligibility for claiming a babygoat.
          </p>)}

          {!whitelisted && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-4">
              <label className="text-xl text-gray-800 font-bold">
                Stake Address
              </label>
              <input
                className={`text-black border-2 border-black rounded-lg p-2 ${
                  err && "border-red-500"
                }`}
                type="text"
                value={stakeAddy}
                onChange={(e) => {
                  setStakeAddy(e.target.value);
                }}
              />

                {badMsg && (
                  <p className="text-red-500 text-center">{badMsg} <br/></p>
                )}

              <button
                type="submit"
                disabled={err || checkLoading}
                className={`bg-black text-white rounded-lg p-2 ${
                  err && "opacity-70 text-gray-400"
                }`}
              >
                {checkLoading ? "Checking..." : "Check"}
              </button>
            </form>
          )}
{whitelisted && (
            <div className="flex flex-col gap-6 mt-12 text-center">
              <p className="text-xl text-gray-800 font-bold">
                You are whitelisted for {whitelistedAmount} babygoat!
              </p>
              <p className="text-xl text-gray-800 ">
              Send 2 ADA to: <br/> <span className="font-bold break-words">addr1v9q54r6t0xdeftuyysjq88hmf8esqsqmrahu5gdtm8634zcr79uh3 </span> 
              <svg
                onClick={copy}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 inline cursor-pointer translate-x-2 hover:stroke-purple-800" 
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                />
              </svg>
              </p>
              <p className="text-xl text-gray-800 ">
              You will get 1.7 ADA back and the baby goat NFT
              </p>

              <p className=" mt-12 text-gray-800  cursor-pointer hover:text-purple-800" onClick={()=>{setWhitelisted(false)}}>
                click to check another wallet
              </p>
</div>)
}

        </div>
      </div>
    </>
  );
};

export default Babygoats;
