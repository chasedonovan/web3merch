/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import TextField from "@mui/material/TextField";
import { NumericKeys } from "react-hook-form/dist/types/path/common";
import emailjs from 'emailjs-com';


type Variant = {
  variant_id: string;
  size: string;
  stock: number;
};

type Props = {
  setShowModal: (showModal: boolean) => void;
  showModal: boolean;
  cartItems: Array<{
    name: string;
    price: number;
    original_price: number;
    image: string;
    images: string[];
    description: string;
    additional_info: string;
    weight: string;
    variants: Variant[];
    itemId: number;
    variant: Variant;
    quantity: number;
  }>;
  total: number;
};

type CheckoutForm = {
  firstName: string;
  lastName: string;
  address: string;
  postalCode: string;
  country: string;
  email: string;
};

export default function CheckoutModal({
  showModal,
  setShowModal,
  cartItems,
  total,
}: Props) {
  const cancelButtonRef = useRef(null);
  const [subTotal, setSubTotal] = useState(0);
  const validationSchema = Yup.object().shape({
    lastName: Yup.string().required("lastname is required"),
    firstName: Yup.string().required("first name is required"),
    address: Yup.string().required("address is required"),
    postalCode: Yup.string().required("postal code is required"),
    country: Yup.string().required("country is required"),
    email: Yup.string().required("email is required"),
  });
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    // get subTotal of cart items
    setSubTotal(
      cartItems.reduce((acc, item) => {
        return acc + item.price;
      }, 0)
    );
  }, [cartItems]);

  const onSubmit = (data: CheckoutForm) => {
    console.log(data);

    // const items = cartItems.reduce((acc, item) => {
    //   return (
    //     acc + `${item.name} x ${item.quantity} @ $${item.price} = $${
    //       item.price * item.quantity
    //     }, \n `
    //   );
    // }, "");

    const items = cartItems.reduce((acc, item) => {
      return (
        acc + `<p>${item.name} x ${item.quantity} @ $${item.price} = $${
          item.price * item.quantity
        }</p> `
      );
    }, "");


    emailjs.send( `service_ra0p0dz`, `template_5j3q9s6`, {
    // emailjs.send( `${process.env.EMAIL_KEY}`, `${process.env.EMAIL_TEMPLATE}`, {
      to_name: data.firstName + " " + data.lastName,
      to_email: data.email,
      from_name: "GoatTribe x Uniscroll",
      address: data.address,
      postal: data.postalCode,
      country: data.country,
      items: items,
      subtotal: `${total}`,
      shipping: `30`,
      total: `${total + 30}` ,
      date_time: new Date().toLocaleString(),
      reply_to: data.email,
    // }, `${process.env.EMAIL_PUBLIC_KEY}`)
  }, `nHKdN2eeVxPRtvKoF`)
      .then((result) => {
          console.log(result.text);
      } 
      , (error) => {
          console.log(error.text);
      }
    );
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
              <Dialog.Panel className=" min-h-min relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border- max-w-screen">
                <div className="sm:flex items-center justify-center">
                  <div className="mt-3 text-center">
                    <Dialog.Title
                      as="h3"
                      className="text-xl font-bold font-quicksand  leading-6 text-black w-full mb-8 text-center "
                    >
                      Delivery and Contact Details
                    </Dialog.Title>
                    <div className="mt-2 px-6">
                      <form onSubmit={handleSubmit(onSubmit)}>
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
                            className="stroke-2 stroke-red-500 "
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
                            className="border border-white"
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
                        <div className="flex flex-row my-2 justify-around mb-0 gap-4 w-full ">
                          <TextField
                            color="secondary"
                            error={errors.email ? true : false}
                            id="outlined-basic"
                            label={
                              errors.email ? errors.email.message : "Email"
                            }
                            variant="outlined"
                            className="border border-white w-full"
                            {...register("email")}
                          />
                        </div>
                        <div className="py-3 flex flex-row-reverse justify-between gap-2 w-full mt-2">
                          <button
                            type="button"
                            className=" mt-3 inline-flex min-w-max justify-center rounded-md border border-black bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm "
                            onClick={() => setShowModal(false)}
                            ref={cancelButtonRef}
                          >
                            Go Back
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
                            type="submit"
                            className=" mt-3 inline-flex w-full justify-center rounded-md border border-black bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0  sm:text-sm disabled:focus:ring-0 disabled:cursor-default disabled:opacity-50 disabled:border-gray-500"
                          >
                            {/* PAY {subTotal + 30} ADA */}
                            PAY {total + 30} ADA
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
