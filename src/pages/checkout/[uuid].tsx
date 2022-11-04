import React, { useEffect } from "react";
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

const checkout = (props: Props) => {
  const [details, setDetails] = React.useState<Details | null>(null);
  const router = useRouter();

  const copy = async () => {
    await navigator.clipboard.writeText(
      `https://merch.uniscroll.io/checkout/${router.query.uuid}`
    );
    alert("Link copied. Save this to keep track of your order.");
  };

  useEffect(() => {
    //fetch payment status
    const fetchPaymentStatus = async () => {
      fetch("/api/cart/nowpaymentstatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart_uuid: router.query.uuid,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Payment status", data);
          setDetails(data);
          // setDetails({
          //   payment_id: 5524759814,
          //   payment_status: "finshed",
          //   pay_address: "TNDFkiSmBQorNFacb3735q8MnT29sn8BLn",
          //   price_amount: 5,
          //   price_currency: "usd",
          //   pay_amount: 165.652609,
          //   actually_paid: 180,
          //   pay_currency: "trx",
          //   order_id: "RGDBP-21314",
          //   order_description: "Apple Macbook Pro 2022 x 1",
          //   purchase_id: "4944856743",
          //   created_at: "2020-12-16T14:30:43.306Z",
          //   updated_at: "2020-12-16T14:40:46.523Z",
          //   outcome_amount: 178.9005,
          //   outcome_currency: "trx",
          // });
        });
    };
    const interval = setInterval(() => {
      fetchPaymentStatus();
    }, 20000);
    fetchPaymentStatus();
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-screen flex justify-center items-center p-2">
      {details ? (
        <div className=" overflow-scroll scrollbar-hide min-w-min h-max flex flex-col justify-center items-center border rounded-lg px-2 sm:px-12 pb-8 pt-6 ">
          <div className="w-max flex justify-center items-center my-2">
            <img src="/goat-logo.png" className="h-18" />{" "}
            <p className="text-xl font-quicksand mx-6 hidden sm:block">X</p>{" "}
            <img src="/uniscroll-full.webp" className="pr-4 sm:block hidden" />
          </div>
          {details.payment_status === "finished" ? (
            <div className="flex gap-2 flex-col justify-center items-center text-center my-2">
              <p className="text-3xl">
                {" "}
                Congratulations, your transaction has been completed!{" "}
              </p>
            </div>
          ) : (
            <div className="flex gap-2 flex-col justify-center items-center text-center my-6 mb-4">
              <p className="text-3xl">
                {" "}
                Your transaction is still processing....{" "}
              </p>
            </div>
          )}
          <h1 className="text-2xl font-bold mt-2">Order Details</h1>
          <div className="flex gap-2 justify-center items-center">
            <h2 className="text-xl font-bold">Payment Status:</h2>
            <p className="text-lg">{details.payment_status}</p>
          </div>
          <div className="flex gap-2 justify-center items-center">
            <h2 className="text-xl font-bold">Order ID:</h2>
            <p className="text-lg">{details.order_id}</p>
          </div>
          <div className="flex gap-2 justify-center items-center">
            <h2 className="text-xl font-bold">Payment ID:</h2>
            <p className="text-lg">{details.payment_id}</p>
          </div>
          <div className="flex gap-2 justify-center items-center">
            <h2 className="text-xl font-bold">Purchase ID:</h2>
            <p className="text-lg">{details.purchase_id}</p>
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
          {details.payment_status === "finished" ? (
            <p className="text-lg text-gray-200 text-center mt-8">
              {" "}
              For your records save or take a screenshot of this page. You can
              also save this link: <br /> https://merch.uniscroll.io/checkout/
              {router.query.uuid}
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
          ) : (
            <p className="sm:text-lg text-gray-200 text-center mt-8 mb-2">
              {" "}
              Please be patient, as this may take some time. <br /> No need to
              reload the page, the status will automatically refresh.
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

export default checkout;
