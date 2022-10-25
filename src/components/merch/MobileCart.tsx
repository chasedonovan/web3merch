import React, { useState, useMemo, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import CartCard from "./CartCard";

type Variant = {
  variant_id: string;
  size: string;
  stock: number;
};

type Props = {
  setCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
  cartOpen: boolean;
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
  setCartItems: (cartItems: any) => void;
  total: number;
  setShowModal: (showModal: boolean) => void;
};

export default function MobileCart({
  setCartOpen,
  cartOpen,
  cartItems,
  setCartItems,
  total,
  setShowModal,
}: Props) {
  return (
    <Transition.Root show={cartOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-40 lg:hidden"
        onClose={setCartOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto relative w-max">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 left-0 -ml-8 flex pt-4 pr-2 sm:-ml-10 sm:pr-4">
                      <button
                        type="button"
                        className="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                        onClick={() => setCartOpen(false)}
                      >
                        <span className="sr-only">Close panel</span>
                        <svg
                          className="h-6 w-6"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>{" "}
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex h-screen flex-col bg-black py-6 shadow-xl">
                    <div className="px-4 sm:px-6 my-2"></div>
                    <div className="relative flex-1 px-4 sm:px-6">
                      {/* <!-- Replace w/ content --> */}
                      <div className="flex flex-col w-1/3 h-full p-2 pr-0 min-w-max">
                        <div className="w-full flex flex-row justify-between items-center border-b border-[#2C2D33]/50">
                          <div className="flex flex-col py-4">
                            <p className="text-xl font-saira">Subtotal:</p>
                            <p className="text-xl">{total} ADA</p>
                            <p className="text-gray-300 text-sm">
                              +shipping (30 ADA)
                            </p>
                          </div>
                          <div className="flex flex-col pl-4 py-4">
                            <button
                              disabled={cartItems.length === 0}
                              className={`font-quicksand border border-white text-white px-8 py-4 rounded-md m-4 ${
                                cartItems.length === 0 &&
                                "opacity-50 cursor-default"
                              }`}
                              onClick={() => {
                                setShowModal(true);
                              }}
                            >
                              Checkout
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-col w-full overflow-scroll scrollbar-hide h-full">
                          {cartItems.map((item, i) => (
                            <CartCard
                              key={i}
                              item={item}
                              cartItems={cartItems}
                              setCartItems={setCartItems}
                            />
                          ))}
                        </div>
                      </div>
                      {/* <!-- /End replace --> */}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
