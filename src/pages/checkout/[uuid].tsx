import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

type Props = {};

type Details = {
  payment_id: number;
  payment_status: string;
  pay_address: string;
  price_amount: number;
  price_currency: string;
  pay_amount: number;
  actually_paid: number;
  pay_currency: string;
  order_id: string;
  order_description: string;
  purchase_id: string;
  created_at: string;
  updated_at: string;
  outcome_amount: number;
  outcome_currency: string;
};

const Checkout = (props: Props) => {
  const [details, setDetails] = useState<Details | null>(null);
  const router = useRouter();
  const uuid = router.query.uuid ?? "";

  const copyLink = async () => {
    await navigator.clipboard.writeText(
      `https://merch.uniscroll.io/checkout/${uuid}`
    );
    alert("Link copied. Save this to keep track of your order.");
  };
  const copyAddress = async () => {
    await navigator.clipboard.writeText(`${details?.pay_address}`);
    alert(
      `Address copied. Send this address ${details?.pay_amount} ${details?.pay_currency} to complete your order.`
    );
  };
  const copyAmount = async () => {
    await navigator.clipboard.writeText(`${details?.pay_amount}`);
    alert(
      `Amount copied. Send to ${details?.pay_address} to complete your order.`
    );
  };

  useEffect(() => {
    if (!router.isReady) return;
    //fetch payment status
    console.log("UseEffect", uuid);
    const fetchPaymentStatus = async () => {
      fetch("/api/cart/nowpaymentstatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart_uuid: uuid,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Payment status", data);
          setDetails(data);
        });
    };
    const interval = setInterval(() => {
      fetchPaymentStatus();
    }, 20000);
    fetchPaymentStatus();
    return () => clearInterval(interval);
  }, [router.isReady]);

  return (
    <div className="w-full h-screen  flex justify-center items-center p-2">
      {details ? (
        <div className="w-max overflow-scroll scrollbar-hide  h-max flex flex-col items-center border min-h-[66%] rounded-lg px-2 sm:px-12 pb-8 pt-6 ">
          <div className="w-max flex justify-center items-center my-2">
            <img src="/goat-logo.png" className="h-18" />{" "}
            <p className="text-xl font-quicksand mx-6 hidden sm:block">X</p>{" "}
            <img src="/uniscroll-full.webp" className="pr-4 sm:block hidden" />
          </div>
          {details.payment_status === "finished" && (
            <div className="flex gap-2 flex-col justify-center items-center text-center my-2">
              <p className="text-3xl">
                {" "}
                Congratulations, your transaction has been completed!{" "}
              </p>
            </div>
          )}
          {details.payment_status === "pending" && (
            <div className="flex gap-2 flex-col justify-center items-center text-center my-6 mb-4">
              <p className="text-3xl">
                {" "}
                Your transaction is still processing....{" "}
              </p>
            </div>
          )}
          {details.payment_status === "waiting" && (
            <div className="flex flex-col justify-around my- h-[75%] w-full">
              <div className="flex flex-col justify-center items-center mt-4 break-words">
                <h2 className="text-xl font-bold ">Payment Address:</h2>
                <p className="text-center break-all">
                  {details.pay_address}
                  <svg
                    onClick={copyAddress}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 inline cursor-pointer translate-x-2 hover:stroke-gray-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                    />
                  </svg>
                </p>
              </div>
              <div className="flex flex-col justify-center items-center mt-2">
                <h2 className="text-xl font-bold">Amount:</h2>
                <p className="text-lg ml-2">
                  {details.pay_amount} {details.pay_currency}
                  <svg
                    onClick={copyAmount}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 inline cursor-pointer translate-x-2 hover:stroke-gray-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                    />
                  </svg>
                </p>
              </div>
              <div className="flex gap-2 flex-col justify-center mt-2 items-center">
                <h2 className="text-xl font-bold">Payment Status:</h2>
                <p className="text-lg">{details.payment_status}</p>
              </div>
            </div>
          )}
          {details.payment_status === "waiting" && (
            <div className="min-w-[48px] flex-col my-auto self-center">
              <img className="h-7 w-64 self-center" src="/loading.svg" />
            </div>
          )}
          {details.payment_status != "waiting" && (
            <div className="flex flex-col my-auto">
              <div className="flex gap-2 justify-center items-center">
                <h2 className="text-xl font-bold">Payment Status:</h2>
                <p className="text-lg">{details.payment_status}</p>
              </div>
              <div className="flex gap-2 justify-center items-center">
                <h2 className="text-xl font-bold">Order Description:</h2>
                <p className="text-lg">{details.order_description}</p>
              </div>
              <div className="flex gap-2 justify-center items-center">
                <h2 className="text-xl font-bold">Price Amount:</h2>
                <p className="text-lg">{details.price_amount}</p>
              </div>
              <div className="flex gap-2 justify-center items-center">
                <h2 className="text-xl font-bold">Price Currency:</h2>
                <p className="text-lg">{details.price_currency}</p>
              </div>
              <div className="flex gap-2 justify-center items-center">
                <h2 className="text-xl font-bold">Pay Amount:</h2>
                <p className="text-lg">{details.pay_amount}</p>
              </div>
              <div className="flex gap-2 justify-center items-center">
                <h2 className="text-xl font-bold">Actually Paid:</h2>
                <p className="text-lg">{details.actually_paid}</p>
              </div>
              <div className="flex gap-2 justify-center items-center">
                <h2 className="text-xl font-bold">Pay Currency:</h2>
                <p className="text-lg">{details.pay_currency}</p>
              </div>
            </div>
          )}
          {details.payment_status === "finished" && (
            <p className="text-lg text-gray-200 text-center mt-8">
              {" "}
              For your records save or take a screenshot of this page. You can
              also save this link: <br /> https://merch.uniscroll.io/checkout/
              {router.query.uuid}
              <svg
                onClick={copyLink}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 inline cursor-pointer translate-x-2 hover:stroke-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                />
              </svg>
            </p>
          )}
          {details.payment_status === "pending" && (
            <p className="sm:text-lg text-gray-200 text-center mt-8">
              {" "}
              Please be patient, as this may take some time. <br /> No need to
              reload the page, the status will automatically refresh.
            </p>
          )}
          {details.payment_status === "waiting" && (
            <p className="sm:text-lg sm:font-bold text-gray-200 text-center mb-auto">
              {" "}
              Please send {details.pay_amount} {details.pay_currency} to the
              address above. <br />{" "}
              <span className="text-base">
              Be patient. The payment process can take up to 10 minutes.
              </span> <br/>
              <span className="text-sm mt-4 text-gray-300">
                No need to reload the page after payment, the status will
                automatically refresh.
              </span>
            </p>
          )}
        </div>
      ) : (
        <div className="w-1/2 h-1/2 flex gap-2 justify-center items-center rounded-lg ">
          <h1 className="text-2xl font-bold">Loading...</h1>
        </div>
      )}
    </div>
  );
};

export default Checkout;
