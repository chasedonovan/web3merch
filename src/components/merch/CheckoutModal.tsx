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
import CardanoWalletAPI from "client/CardanoWalletAPI";
import AlertModal from "./../AlertModal";
import SuccessModal from "./../SuccessModal";

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
  const { products, cart, setCart, orderAddress, setAddress } =
    useMerchContext();
  const [loadingTx, setLoadingTx] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [showErr2, setShowErr2] = useState(false);
  const [errMessage2, setErrMessage2] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const cancelButtonRef = useRef(null);
  const validationSchema = Yup.object().shape({
    lastName: Yup.string().required("lastname is required"),
    firstName: Yup.string().required("first name is required"),
    address: Yup.string().required("address is required"),
    postalCode: Yup.string().required("postal code is required"),
    country: Yup.string().required("country is required"),
    email: Yup.string().required("email is required"),
    phone: Yup.string(),
    state: Yup.string(),
  });
  const { protocolParameters } = useGlobalContext();

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
    watch,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    setLoadingTx(true);
    fetch("/api/cart/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cart: {
          uuid: cart.cartUuid,
          stake_key: connectedWallet.stakeAddress,
          cartItems: cart.cartItems,
          address: {
            first_name: orderAddress.firstName,
            last_name: orderAddress.lastName,
            street_address: orderAddress.streetAddress,
            postal_code: orderAddress.postalCode,
            country: orderAddress.country,
            state: orderAddress.state,
            phone: orderAddress.phone,
            email: orderAddress.email,
          },
        },
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log("data", data);
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
          });
          setLoadingTx(false);
        } else {
          setErrMsg(data.detail);
          console.log("error", data);
        }
      });
  }, []);

  const handlePayment = async () => {
    if (isConnected) {
      console.log(cart.totalPrice);

      // await CardanoWalletAPI.pay(
      //   connectedWallet.providerapi,
      //   protocolParameters,
      //   cart.payToAddress,
      //   cart.totalPrice
      // )
      await fetch("/api/cart/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart: cart,
        }),
      })
        .then((res) => {
          console.log("Handle payment", res);
          // if (!res.success) throw res;

          // fetch("/api/cart/checkout", {
          //   method: "POST",
          //   headers: {
          //     "Content-Type": "application/json",
          //   },
          //   body: JSON.stringify({
          //     cart_uuid: cart.cartUuid,
          //     transaction_id: res.transactionId,
          //   }),
          // }).then((res2) => {
          //   if (res2.status !== 200) {
          //     console.log(res2);
          //     throw {
          //       success: false,
          //       message:
          //         "Failed to update your order, save the transaction id and contact Uniscroll.",
          //       transactionId: "",
          //     };
          //   }
          // });
          setLoading(false);
          setLoadingTx(false);

          const itemList = cart.cartItems.map((item) => {
            const product = products.find(
              (product) => product.name === item.name
            );
            return `<br/> <br/> <img style="height:100px; width:100px;" src='https://merch.uniscroll.io${
              product?.image
            }'  alt='${item.name}' width="98" height="98"/> <br/> ${
              item.name
            } - ${item.quantity} x $${item.price} = ${
              item.quantity * item.price
            }`;
          });
          emailjs
            .send(
              `${process.env.EMAIL_KEY}`,
              `${process.env.EMAIL_TEMPLATE}`,
              {
                to_email: orderAddress.email,
                to_name: orderAddress.firstName + " " + orderAddress.lastName,
                address: orderAddress.streetAddress,
                postal: orderAddress.postalCode,
                country: orderAddress.country,
                items: `<div>${itemList}</div>`,
                subtotal: `${cart.subTotalPrice}`,
                shipping: `${cart.shippingPrice}`,
                total: `${cart.totalPrice}`,
                date_time: new Date().toLocaleString(),
              },
              `${process.env.EMAIL_PUBLIC_KEY}`
            )
            .then(
              (result) => {
                console.log(result.text);
              },
              (error) => {
                console.log(error.text);
              }
            );
          setShowSuccess(true);
          // setSuccessMessage("" + res.message + " " + res.transactionId);
          setSuccessMessage("");
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
      // props.setErrMessage("Please connect your wallet");
      // props.setShowErr(true);
      // props.setShowModal(false);
    }
  };

  const onSubmit = async (data: CheckoutForm) => {
    console.log("submit address", data);

    setAddress({
      ...orderAddress,
      firstName: data.firstName,
      lastName: data.lastName,
      streetAddress: data.address,
      postalCode: data.postalCode,
      country: data.country,
      email: data.email,
      phone: data.phone,
      state: data.state,
    });
    setLoadingTx(true);
    await fetch("/api/cart/address", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cart_uuid: cart.cartUuid,
        stake_key: connectedWallet.stakeAddress,
        address: {
          first_name: data.firstName,
          last_name: data.lastName,
          street_address: data.address,
          postal_code: data.postalCode,
          country: data.country,
          state: data.state,
          phone: data.phone,
          email: data.email,
        },
      }),
    }).then(async () => await handlePayment());
  };

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
                } min-h-min relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg border  max-w-screen`}
              >
                <div className="sm:flex items-center justify-center">
                  <div className="mt-3 text-center">
                    <Dialog.Title
                      as="h3"
                      className="text-xl font-bold font-quicksand  leading-6 text-black w-full mb-8 text-center"
                    >
                      Delivery and Contact Details
                    </Dialog.Title>
                    <div className="mt-2 px-6">
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
                              </div>

                              <TextField
                                color="secondary"
                                error={errors.country ? true : false}
                                id="outlined-basic"
                                label={
                                  errors.country
                                    ? errors.country.message
                                    : "Country"
                                }
                                variant="outlined"
                                className="border border-white"
                                {...register("country")}
                              />
                            </div>
                            <div className="flex flex-col sm:flex-row my-2 justify-around mb-0 gap-2 sm:gap-4 w-full ">
                              <TextField
                                color="secondary"
                                error={errors.email ? true : false}
                                id="outlined-basic"
                                label={
                                  errors.email ? errors.email.message : "Email"
                                }
                                variant="outlined"
                                className="border border-white sm:w-1/2"
                                {...register("email")}
                              />
                              <TextField
                                color="secondary"
                                error={errors.phone ? true : false}
                                id="outlined-basic"
                                label={
                                  errors.phone ? errors.phone.message : "Phone"
                                }
                                variant="outlined"
                                className="border border-white sm:w-1/2"
                                {...register("phone")}
                              />
                            </div>
                          </>
                        )}

                        {cart.subTotalPrice && cart.shippingPrice ? (
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
                            Go Back
                          </button>
                          {cart.subTotalPrice && cart.shippingPrice ? (
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
                              type="submit"
                              className="relative overflow-hidden mt-3 h-[42px] sm:h-[38px] inline-flex w-full justify-center rounded-md border border-black bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0  sm:text-sm disabled:focus:ring-0 disabled:cursor-default disabled:opacity-50 disabled:border-gray-500"
                            >
                              {!cart.totalPrice || loadingTx ? (
                                <img
                                  src="/loadingblack.gif"
                                  className="relative -top-5 h-[64px] "
                                />
                              ) : (
                                `PAY $${cart.totalPrice} ${
                                  cart.estimatedTotal > 0
                                    ? `(~${cart.estimatedTotal} ADA)`
                                    : ""
                                }`
                              )}
                            </button>
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
