/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import TextField from "@mui/material/TextField";
import emailjs from "emailjs-com";
import { useWalletContext } from "hooks/useWalletContext";
import { useMerchContext } from "hooks/useMerchContext";
import { useGlobalContext } from "hooks/useGlobalContext";
import AlertModal from "./../AlertModal";
import SuccessModal from "./../SuccessModal";
import { countries } from "../../data/countries.js";
import { MuiTelInput } from "mui-tel-input";
import { useRouter } from "next/router";

type Variant = {
  variant_id: string;
  size: string;
  stock: number;
};

type Props = {
  setShowModal: (showModal: boolean) => void;
  showModal: boolean;
};

type CheckoutForm = {
  firstName: string;
  lastName: string;
  address: string;
  postalCode: string;
  country: string;
  email: string;
  state: string;
  phone: string;
};

export default function CheckoutModal({ showModal, setShowModal }: Props) {
  const router = useRouter();
  const { products, cart, setCart, orderAddress, setAddress } =
    useMerchContext();
  const [loadingTx, setLoadingTx] = useState(false);
  const [loadingN, setLoadingN] = useState(false);
  const [loadingP, setLoadingP] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [showErr2, setShowErr2] = useState(false);
  const [errMessage2, setErrMessage2] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const cancelButtonRef = useRef(null);
  const [phone, setPhone] = useState("");
  const [approved, setApproved] = useState(false);
  const [currencySelect, setCurrencySelect] = useState(false);
  const validationSchema = Yup.object().shape({
    lastName: Yup.string().required("lastname is required"),
    firstName: Yup.string().required("first name is required"),
    address: Yup.string().required("address is required"),
    postalCode: Yup.string().required("postal code is required"),
    country: Yup.string().required("country is required"),
    email: Yup.string().email().required("email is required"),
    // phone: Yup.string().matches(phoneRegExp, 'Phone number is not valid').required(),
    state: Yup.string(),
  });

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

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: yupResolver(validationSchema),
  });
  const watchCountry = watch("country");

  useEffect(() => {
    setValue("firstName", orderAddress.first_name);
    setValue("lastName", orderAddress.last_name);
    setValue("address", orderAddress.street_address);
    setValue("postalCode", orderAddress.postal_code);
    setValue("country", orderAddress.country);
    setValue("email", orderAddress.email);
    setValue("state", orderAddress.state);
    setValue("phone", orderAddress.phone);
  }, []);

  const handlePayment = async () => {
    if (isConnected && approved) {
      setLoadingTx(true);
      await fetch("/api/cart/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart_uuid: cart.cartUuid,
          paymentMethod: cart.paymentMethod,
        }),
      })
        .then((res) => {
          if (res.status === 200) {
            router.push(`/checkout/${cart.cartUuid}`);
            return res.json();
          } else {
            throw new Error("Something went wrong");
          }
        })
        .then((data) => {
          console.log("d", data);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          setShowErr2(true);
          setErrMessage2(err?.message);
          setLoadingTx(false);
        });
    } else {
      setLoadingTx(false);
    }
  };

  const handleCheckout = async () => {
    setLoadingP(true);
    await fetch("/api/cart/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cart: {
          uuid: cart.cartUuid,
          stake_key: connectedWallet.stakeAddress,
          cartItems: cart.cartItems,
          paymentMethod: cart.paymentMethod,
          address: orderAddress,
        },
      }),
    })
      .then(async (res) => res.json())
      .then((data) => {
        if (data && data.success != "false") {
          setCart({
            ...cart,
            payToAddress: data.pay_to_address,
            transactionId: data.transaction_id,
            subTotalPrice: data.subtotal_price,
            shippingPrice: data.shipping_price,
            totalPrice: data.total_price,
            cartUuid: data.uuid,
            estimatedTotal: data.estimated_total,
            estimatedCurrency: data.estimated_currency,
          });
          setApproved(true);
          setCurrencySelect(false);
        } else {
          setErrMsg(data.detail);
          console.log("error", data);
        }
      });
    setLoadingP(false);
  };

  const onSubmit = async (data: CheckoutForm) => {
    setLoadingN(true);
    setAddress({
      ...orderAddress,
      first_name: data.firstName,
      last_name: data.lastName,
      street_address: data.address,
      postal_code: data.postalCode,
      country: data.country,
      email: data.email,
      phone: phone,
      state: data.state,
    });
    //post cart to shipping endpoint to get shipping price
    await fetch("/api/cart/shipping", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cart: {
          uuid: cart.cartUuid,
          stake_key: connectedWallet.stakeAddress,
          cartItems: cart.cartItems,
          paymentMethod: cart.paymentMethod,
          address: orderAddress,
        },
      }),
    })
      .then(async (res) => res.json())
      .then((data) => {
        console.log(orderAddress);
        if (data && data.success != "false") {
          setCart({
            ...cart,
            shippingPrice: data.shipping_price,
            totalPrice: data.shipping_price + cart.subTotalPrice,
          });
          setLoadingN(false);
          setCurrencySelect(true);
        } else {
          setErrMsg(data.detail);
          console.log("error", data);
        }
      });
    setLoadingN(false);
    setCurrencySelect(true);
  };

  const handleChange = (e: any) => {
    setPhone(e);
    console.log(phone);
  };

  function money_round(num: number) {
    return Math.ceil(num * 100) / 100;
  }

  return (
    <Transition.Root show={showModal} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        initialFocus={cancelButtonRef}
        onClose={setShowModal}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className={`${
                  errMsg && "bg-red-100 border border-red-400"
                } relative transform overflow-hidden rounded-lg min-h-[298px] bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg border  max-w-screen`}
              >
                <div className="sm:flex items-center justify-center h-full">
                  <div className="mt-3 text-center h-full flex flex-col justify-between">
                    <Dialog.Title
                      as="h3"
                      className="text-xl font-bold font-quicksand  leading-6 text-black w-full text-center"
                    >
                      {currencySelect || approved
                        ? "Checkout"
                        : "Delivery and Contact Details"}
                    </Dialog.Title>
                    <div className="mt-2 px-6 h-full">
                      {currencySelect && !approved && (
                        <div className="flex flex-col justify-between h-full">
                          <div className="font-bold font-quicksand text-black mt-2">
                            Sub total:{" "}
                            {cart.subTotalPrice
                              ? " $" + cart.subTotalPrice
                              : ""}
                          </div>
                          <div className="font-quicksand text-black">
                            +Shipping:{" "}
                            {cart.shippingPrice
                              ? " $" + cart.shippingPrice
                              : ""}
                          </div>
                          <div className="font-quicksand text-black">
                            Total:{" "}
                            {cart.totalPrice
                              ? " $" + money_round(cart.totalPrice)
                              : ""}
                          </div>
                          <div
                            className={`py-3 flex gap-2 w-full mt-2 ${
                              !errMsg && "mb-4"
                            }  h-max justify-center`}
                          >
                            <p className="text-black font-bold font-quicksand self-center">
                              Payment Method
                            </p>
                            <p className="self-center text-black mr-2">:</p>
                            <select
                              className="border my-auto border-black text-black rounded-md w-max p-2 justify-self-end font-bold font-quicksand"
                              value={cart.paymentMethod}
                              onChange={(e) =>
                                console.log(cart.paymentMethod) == undefined &&
                                setCart({
                                  ...cart,
                                  paymentMethod: e.target.value,
                                })
                              }
                            >
                              {/* ADA, BTC, ETH, SOL, USDC */}
                              <option value="ADA">ADA</option>
                              <option value="BTC">BTC</option>
                              <option value="ETH">ETH</option>
                              <option value="SOL">SOL</option>
                              <option value="USDC">USDC</option>
                            </select>
                          </div>
                          {errMsg && (
                            <div
                              className=" text-red-700 px-4 rounded relative mb-4"
                              role="alert"
                            >
                              <span className="block sm:inline">{errMsg}</span>
                            </div>
                          )}
                          <div className="py-3 flex flex-row-reverse justify-between gap-2 w-full mt-2">
                            <button
                              type="button"
                              className="self-center mt-3 flex flex-col max-h-[42px] min-w-max justify-center rounded-md border border-black bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm "
                              onClick={() => setShowModal(false)}
                              ref={cancelButtonRef}
                            >
                              Go back
                            </button>

                            <button
                              disabled={!cart.paymentMethod}
                              onClick={handleCheckout}
                              className={`self-center min-w-[124px] relative w-full mt-3 flex flex-col max-h-[42px] items-center px-12 justify-center rounded-md border border-black bg-white py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:text-sm `}
                            >
                              {!cart.subTotalPrice || loadingP
                                ? "loading..."
                                : "Next"}
                            </button>
                          </div>
                        </div>
                      )}
                      {!currencySelect && !approved && (
                        <form onSubmit={handleSubmit(onSubmit)}>
                          {errMsg ? (
                            <div
                              className=" text-red-700 px-4 py-3 rounded relative mb-4"
                              role="alert"
                            >
                              <span className="block sm:inline">{errMsg}</span>
                            </div>
                          ) : (
                            <>
                              <div className="flex flex-col sm:flex-row my-2 justify-between mb-0 gap-2 w-full ">
                                <TextField
                                  color="secondary"
                                  error={errors.firstName ? true : false}
                                  id="outlined-basic"
                                  label={
                                    errors.firstName
                                      ? errors.firstName.message
                                      : "First Name"
                                  }
                                  variant="outlined"
                                  className="stroke-2 stroke-red-500 sm:w-1/2 "
                                  {...register("firstName")}
                                />
                                <TextField
                                  color="secondary"
                                  error={errors.lastName ? true : false}
                                  id="outlined-basic"
                                  label={
                                    errors.lastName
                                      ? errors.lastName.message
                                      : "Last Name"
                                  }
                                  variant="outlined"
                                  className="border border-white sm:w-1/2"
                                  {...register("lastName")}
                                />
                              </div>
                              <div className="flex flex-row my-2 justify-around mb-0 gap-4 w-full">
                                <TextField
                                  color="secondary"
                                  error={errors.address ? true : false}
                                  id="outlined-basic"
                                  label={
                                    errors.address
                                      ? errors.address.message
                                      : "Address"
                                  }
                                  variant="outlined"
                                  className="border border-white w-full"
                                  {...register("address")}
                                />
                              </div>
                              <div className="flex flex-col sm:flex-row my-2 justify-between w-full mb-0 gap-2  ">
                                <div className="flex gap-2">
                                  <TextField
                                    color="secondary"
                                    error={errors.postalCode ? true : false}
                                    id="outlined-basic"
                                    label={
                                      errors.postalCode
                                        ? errors.postalCode.message
                                        : "Postal Code"
                                    }
                                    variant="outlined"
                                    className="border border-white"
                                    {...register("postalCode")}
                                  />
                                  <TextField
                                    color="secondary"
                                    error={errors.state ? true : false}
                                    id="outlined-basic"
                                    label={
                                      errors.state
                                        ? errors.state.message
                                        : "State"
                                    }
                                    variant="outlined"
                                    className="border border-white"
                                    {...register("state")}
                                  />{" "}
                                  <select
                                    defaultValue=""
                                    className={`border w-1/3 rounded-md text-gray-800 font-light cursor-pointer ${
                                      watchCountry === "" && "text-gray-400"
                                    } ${
                                      errors.country
                                        ? " border-red-500 text-red-500"
                                        : " border-gray-400"
                                    }`}
                                    {...register("country")}
                                  >
                                    <option
                                      disabled
                                      value=""
                                      className="text-gray-500"
                                    >
                                      Country
                                    </option>
                                    {countries.map((country, index) => (
                                      <option key={index} value={country.name}>
                                        {country.name}
                                      </option>
                                    ))}
                                  </select>{" "}
                                </div>
                              </div>
                              <div className="flex flex-col sm:flex-row my-2 justify-around mb-0 gap-2 sm:gap-4 w-full ">
                                <TextField
                                  color="secondary"
                                  error={errors.email ? true : false}
                                  id="outlined-basic"
                                  label={
                                    errors.email
                                      ? errors.email.message
                                      : "Email"
                                  }
                                  variant="outlined"
                                  className="border border-white sm:w-1/2"
                                  {...register("email")}
                                />
                                <MuiTelInput
                                  defaultCountry="US"
                                  value={phone}
                                  onChange={handleChange}
                                />
                                {/* <TextField
                                color="secondary"
                                error={errors.phone ? true : false}
                                id="outlined-basic"
                                label={
                                  errors.phone ? errors.phone.message : "Phone"
                                }
                                variant="outlined"
                                className="border border-white sm:w-1/2"
                                {...register("phone")}
                              /> */}
                              </div>
                            </>
                          )}

                          {cart.subTotalPrice &&
                          cart.shippingPrice &&
                          approved ? (
                            <>
                              <div className="font-bold font-quicksand text-black mt-2">
                                Sub total:{" "}
                                {cart.subTotalPrice
                                  ? " $" + cart.subTotalPrice
                                  : ""}
                              </div>
                              <div className="font-quicksand text-black">
                                +Shipping:{" "}
                                {cart.shippingPrice
                                  ? " $" + cart.shippingPrice
                                  : ""}
                              </div>
                            </>
                          ) : (
                            ""
                          )}
                          <div className="py-3 flex flex-row-reverse justify-between gap-2 w-full mt-2">
                            <button
                              type="button"
                              className="self-center mt-3 flex flex-col max-h-[42px] min-w-max justify-center rounded-md border border-black bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm "
                              onClick={() => setShowModal(false)}
                              ref={cancelButtonRef}
                            >
                              Go back
                            </button>
                            {!approved ? (
                              <div className="flex  w-full justify-around">
                                <button
                                  disabled={
                                    // phone.length < 7 ||
                                    errors.address ||
                                    errors.country ||
                                    errors.email ||
                                    errors.firstName ||
                                    errors.lastName ||
                                    errors.postalCode
                                      ? true
                                      : false
                                  }
                                  type="submit"
                                  className="relative overflow-hidden mt-3 h-[42px] sm:h-[38px] inline-flex w-1/3 justify-center rounded-md border border-black bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0  sm:text-sm disabled:focus:ring-0 disabled:cursor-default disabled:opacity-50 disabled:border-gray-500"
                                >
                                  {!cart.subTotalPrice || loadingN ? (
                                    <img
                                      src="/loadingblack.gif"
                                      className="relative -top-5 h-[64px] "
                                    />
                                  ) : (
                                    "Next"
                                  )}
                                </button>
                                <p className="text-black self-center text-sm mx-2 text-left w-max">
                                  Subtotal: ${cart.subTotalPrice}{" "}
                                </p>
                              </div>
                            ) : (
                              <img
                                src={"/loading.svg"}
                                alt="loading"
                                className={`w-16 h-16 mx-auto my-4 ${
                                  errMsg && "hidden"
                                }`}
                              />
                            )}
                          </div>
                        </form>
                      )}
                      {approved && (
                        <form
                          onSubmit={handleSubmit(onSubmit)}
                          className="h-full"
                        >
                          {errMsg ? (
                            <div
                              className=" text-red-700 px-4 py-3 rounded relative mb-4"
                              role="alert"
                            >
                              <span className="block sm:inline">{errMsg}</span>
                            </div>
                          ) : (
                            <></>
                          )}
                          <div className="flex flex-col gap- pb-1">
                            {cart.cartItems.map((item) => (
                              <p className="text-gray-800 font-quicksand ">
                                {item.quantity +
                                  "x " +
                                  item.name +
                                  " (" +
                                  item.variant.size +
                                  " (id:" +
                                  item.variant_id +
                                  ")" +
                                  ")"}
                              </p>
                            ))}
                          </div>
                          <div className="flex flex-col gap- ">
                            {/* details summary with address info */}
                            {/* <h4 className=" text-black">Details Summary:</h4> */}
                            <p className="text-gray-800 font-quicksand">
                              Name: {orderAddress.first_name}{" "}
                              {orderAddress.last_name}
                            </p>
                            <p className="text-gray-800 font-quicksand">
                              Address: {orderAddress.street_address},{" "}
                              {orderAddress.postal_code},{" "}
                              {orderAddress.state && orderAddress.state},{" "}
                              {orderAddress.country}
                            </p>
                            <p className="text-gray-800 font-quicksand ">
                              Email: {orderAddress.email}
                            </p>
                            {orderAddress.phone && (
                              <p>Phone: {orderAddress.phone}</p>
                            )}
                            <p className="text-gray-800 font-quicksand mb-2">
                              Payment Method: {cart.estimatedCurrency}
                            </p>
                            <button
                              type="button"
                              className="mb-4 w-full border rounded-2xl hover:border-orange-300"
                              onClick={() => setApproved(false)}
                            >
                              <p className="text-gray-800 font-quicksand ">
                                Edit
                              </p>
                            </button>
                          </div>
                          <div className="font-bold font-quicksand text-black">
                            Sub total:{" "}
                            {cart.subTotalPrice
                              ? " $" + cart.subTotalPrice
                              : ""}
                          </div>
                          <div className="font-quicksand font-bold text-black">
                            +Shipping:{" "}
                            {cart.shippingPrice
                              ? " $" + cart.shippingPrice
                              : ""}
                          </div>
                          <div className="font-quicksand font-bold text-black">
                            Total:{" "}
                            {cart.totalPrice ? " $" + cart.totalPrice : ""}
                          </div>
                          <div className="font-quicksand font-bold text-black mb-6">
                            Estimated Total:{" "}
                            {cart.estimatedTotal
                              ? cart.estimatedTotal +
                                " " +
                                cart.estimatedCurrency
                              : ""}
                          </div>
                          <div className="py-3 flex flex-row-reverse justify-between gap-2 w-full mt-2">
                            <button
                              type="button"
                              className="self-center mt-3 flex flex-col max-h-[42px] min-w-max justify-center rounded-md border border-black bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm "
                              onClick={() => setShowModal(false)}
                              ref={cancelButtonRef}
                            >
                              Go back
                            </button>

                            <button
                              disabled={
                                errors.address ||
                                errors.country ||
                                errors.email ||
                                errors.firstName ||
                                errors.lastName ||
                                errors.postalCode
                                  ? true
                                  : false
                              }
                              onClick={handlePayment}
                              className={`relative overflow-hidden mt-3 h-[42px] min-h-min sm:h-[38px] inline-flex w-full justify-center rounded-md  bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0  sm:text-sm disabled:focus:ring-0 disabled:cursor-default disabled:opacity-50 disabled:border-gray-500 ${
                                loadingTx
                                  ? "border-none"
                                  : "border-black border"
                              }`}
                            >
                              {!cart.estimatedTotal || loadingTx ? (
                                <img
                                  src="/loadingblack.gif"
                                  className="relative -top-5 h-[64px] "
                                />
                              ) : (
                                <p className="flex ">
                                  {" "}
                                  <span className="hidden sm:block">
                                    {cart.estimatedTotal > 0
                                      ? `Pay (~${cart.estimatedTotal} ${cart.estimatedCurrency})`
                                      : ""}
                                  </span>
                                </p>
                              )}
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
                {showErr2 && (
                  <AlertModal
                    showModal={showErr2}
                    setShowModal={setShowErr2}
                    message={errMessage2}
                  />
                )}
                {showSuccess && (
                  <SuccessModal
                    showModal={showSuccess}
                    setShowModal={setShowSuccess}
                    message={successMessage}
                  />
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
