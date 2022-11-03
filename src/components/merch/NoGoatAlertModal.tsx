/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
//

type Props = {
  message: any;
  setNoGoats: (noGoats: boolean) => void;
  noGoats: boolean;
};

export default function NoGoatsAlertModal({
  noGoats,
  setNoGoats,
  message,
}: Props) {
  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={noGoats} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        initialFocus={cancelButtonRef}
        onClose={setNoGoats}
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
              <Dialog.Panel className="min-w-min min-h-min relative transform overflow-hidden rounded-lg bg-[#0D0D0D] text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl border border-white">
                <div className="bg-[#0D0D0D] px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="w-full mt-3 text-center sm:mt-0 sm:mx-4">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-white"
                      >
                        Sorry, but you cannot enter.. you do not have a goat.
                      </Dialog.Title>
                      <div className="mt-2 overflow-scroll scrollbar-hide flex-col flex justify-center">
                        {/* <p className="max-w-screen text-sm text-gray-400 whitespace-normal overflow-scroll scrollbar-hide ">
                          Sorry, but you cannot enter.. you do not have a goat.
                        </p> */}
                        <img
                          src="/merch/goat/6-sticker6.png"
                          className="h-64 self-center mb-4"
                        />
                        <p className="max-w-screen text-sm text-gray-200 whitespace-normal overflow-scroll scrollbar-hide">
                          Buy one on{" "}
                          <a href="https://www.jpg.store/collection/goattribe">
                            JPEG.store,{" "}
                          </a>
                          then come back to cop some merch !
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 sm:flex sm:justify-end sm:px-8 w-full">
                  <a
                    href="https://www.jpg.store/collection/goattribe"
                    className="self-center w-full sm:w-2/3"
                  >
                    <button
                      type="button"
                      className=" w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#FFDB24] text-base font-medium text-black hover:bg-[#c1a621] sm:ml-3 sm:text-sm"
                      onClick={() => setNoGoats(false)}
                    >
                      Take me to buy a Goat
                    </button>
                  </a>
                  <button
                    type="button"
                    className="min-w-max mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => setNoGoats(false)}
                    ref={cancelButtonRef}
                  >
                    Go Back
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
