import { Fragment, useRef, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useMerchContext } from "hooks/useMerchContext";

interface IFormInput {
  size: string;
}
type Props = {
  item: any;
  setShowModal: (showModal: boolean) => void;
  showModal: boolean;
  setShowCart: (showCart: boolean) => void;
};

export default function ItemDetailsModal({
  showModal,
  setShowModal,
  item,
  setShowCart,
}: Props) {
  const { cart, setCart } = useMerchContext();
  const cancelButtonRef = useRef(null);
  const [imgIndex, setImgIndex] = useState(0);
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("");
  const [err, setErr] = useState(false);

  useEffect(() => {
    if (item && item.variants && item.variants[0].size === "OneSize") {
      setSize(item.variants[0].size);
    }
  }, [item.variants]);

  const handleRightClick = () => {
    if (imgIndex < item.images.length - 1) {
      setImgIndex(imgIndex + 1);
    }
  };

  const handleLeftClick = () => {
    if (imgIndex > 0) {
      setImgIndex(imgIndex - 1);
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // console.log(data);
    if (size === "" && item.variants[0].size !== "OneSize") {
      setErr(true);
    } else {
      const itemInCart = cart.cartItems.find(
        (cartItem) =>
          cartItem.variant.size === size && cartItem.name === item.name
      );

      if (itemInCart) {
        if (itemInCart.quantity < itemInCart.variant.stock) {
          const newCartItems = cart.cartItems.map((item) => {
            if (item.variant.size === size && item.name === item.name) {
              return {
                ...item,
                quantity: item.quantity + quantity,
              };
            }
            return item;
          });
          setCart({
            ...cart,
            cartItems: newCartItems,
          });
        }
      } else {
        // Add item to cart
        const variant = item.variants.find(
          (variant: any) => variant.size === size
        );

        const newCartItem = {
          name: item.name,
          variant: variant,
          quantity: quantity,
          price: item.price,
          variant_id: variant ? variant.variant_id : "",
        };
        setCart({
          ...cart,
          cartItems: [...cart.cartItems, newCartItem],
        });
      }
      if (cart.cartItems.length === 0) {
        setShowCart(true);
      }
      setQuantity(1);
      setTimeout(() => {
        setShowModal(false);
      }, 100);
    }
  };

  const handleSizeChange = (e: any) => {
    setSize(e.target.value);
    setErr(false);
  };
  return (
    <Transition.Root show={showModal} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50 "
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

        <div className="fixed inset-0 z-50 overflow-y-auto scrollbar-hide">
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
              <Dialog.Panel className="ease-in duration-300 min-w-min min-h-min relative transform overflow-hidden rounded-md bg-[#0D0D0D] text-left shadow-xl transition-all sm:my-8 w-min sm:w-full sm:max-w-[80%] md:max-w-[60%] border border-gray-600">
                <div className="bg-[#0D0D0D] px-0 pt-2  pb-2 xl:hidden">
                  <div className=" text-center sm:mt-0 sm:text-left">
                    <div className="flex justify-between px-3 pt-3 pb-2">
                      <div className="flex flex-col">
                        <Dialog.Title
                          as="h3"
                          className="text-lg text-left font-medium leading-6 text-white w-max"
                        >
                          {item.name}
                        </Dialog.Title>{" "}
                      </div>
                      <p
                        className="text-right ml-4 w-1/4 hover:cursor-pointer"
                        onClick={() => setShowModal(false)}
                      >
                        X
                      </p>
                    </div>

                    <div className="relative mt-2 scrollbar-hide flex  overflow-scroll w-full sm:h-[464px]">
                      {item.images.map((image: any, i: number) => (
                        <div
                          key={i}
                          className={`${
                            imgIndex === i ? "block" : "hidden"
                          } w-full object-contain max-h-[242px] sm:max-h-[464px]`}
                        >
                          <img
                            src={image}
                            className="w-full h-full object-contain max-h-[242px] sm:max-h-[464px] rounded-sm"
                          />
                        </div>
                      ))}
                      {imgIndex > 0 && (
                        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 ml-2">
                          <button
                            className="bg-gray-800 hover:bg-gray-600 hover:cursor-pointer rounded-full"
                            onClick={handleLeftClick}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                              />
                            </svg>
                          </button>
                        </div>
                      )}
                      {imgIndex < item.images.length - 1 && (
                        <div className="absolute top-1/2 right-0 transform -translate-y-1/2 mr-2">
                          <button
                            className="bg-gray-800 hover:bg-gray-600 hover:cursor-pointer rounded-full"
                            onClick={handleRightClick}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="w-full px-4 pb-3 flex flex-row justify-between gap-2 xl:hidden">
                  <div className=" sm:w-2/3 self-center pb-4 ">
                    Description
                    <p className="max-w-screen whitespace-normal overflow-scroll scrollbar-hide text-sm text-gray-400">
                      {item.description}
                    </p>
                    {item.additional_info && (
                      <div className="mt-2">
                        Additional Info{" "}
                        {showAdditionalInfo ? (
                          <button
                            className="text-sm text-gray-400 hover:cursor-pointer"
                            onClick={() => setShowAdditionalInfo(false)}
                          >
                            ...hide
                          </button>
                        ) : (
                          <button
                            className="text-sm text-gray-400 hover:cursor-pointer"
                            onClick={() => setShowAdditionalInfo(true)}
                          >
                            ...show
                          </button>
                        )}
                        {showAdditionalInfo && (
                          <div
                            className="mt-1 max-w-screen whitespace-normal overflow-scroll scrollbar-hide text-sm text-gray-400 ease-in duration-500 flex flex-col gap-2"
                            dangerouslySetInnerHTML={{
                              __html: item.additional_info,
                            }}
                          />
                        )}
                      </div>
                    )}
                  </div>
                  <form
                    onSubmit={handleSubmit}
                    className="flex flex-col justify-start items-center sm:py-2 min-w-max"
                  >
                    <p className="self-end text-right text-gray-200 ">
                      {item.price / 1000000} ₳
                    </p>
                    {item.original_price !== item.price ? (
                      <p className="self-end text-right text-gray-200 line-through opacity-75">
                        {item.original_price / 1000000} ₳
                      </p>
                    ) : (
                      ""
                    )}
                    <div className="flex flex-col lg:flex-row justify-end mt-2 ">
                      {item &&
                        item.variants &&
                        item.variants[0].size === "OneSize" && (
                          <div className="flex flex-row justify-end">
                            <div className="pr-2 mb-2 font-quicksand self-center hidden ">
                              Quantity
                            </div>
                            <select
                              autoFocus
                              className={`pl-2 bg-[#0d0d0d] hover:cursor-pointer font-quicksand focus:outline-none text-sm mb-2 lg:mr-2 self-center`}
                              value={quantity}
                              onChange={(e) =>
                                setQuantity(parseInt(e.target.value))
                              }
                            >
                              <>
                                {Array.from(
                                  {
                                    length: Math.min(
                                      item.variants[0].stock,
                                      100
                                    ),
                                  },
                                  (_, i) => i + 1
                                ).map((num) => (
                                  <option key={num} value={num}>
                                    {item &&
                                    item.variants &&
                                    num === item.variants[0].stock
                                      ? num + " left"
                                      : `${num}`}
                                  </option>
                                ))}
                              </>
                            </select>
                          </div>
                        )}
                      <select
                        autoFocus
                        disabled={
                          item?.variants && item.variants[0].size === "OneSize"
                        }
                        className={`${
                          item?.variants &&
                          item.variants[0].size === "OneSize" &&
                          "hidden "
                        } pr-4 py-2 bg-[#0d0d0d] hover:cursor-pointer font-quicksand focus:outline-none self-end lg:mr-4 ${
                          err && "rounded-lg text-red-400"
                        }`}
                        value={size}
                        onChange={handleSizeChange}
                      >
                        {item &&
                        item.variants &&
                        item.variants[0].size === "OneSize" ? (
                          <option value="OneSize">One Size</option>
                        ) : (
                          <>
                            <option value="" disabled>
                              Size
                            </option>
                            {item &&
                              item.variants &&
                              item.variants.map((variant: any) => (
                                <option
                                  key={variant.size}
                                  value={variant.size}
                                  disabled={variant.stock === 0}
                                >
                                  {variant.size}{" "}
                                  {variant.stock === 0 && "sold out"}
                                </option>
                              ))}
                          </>
                        )}
                      </select>
                      <button
                        disabled={err}
                        type="submit"
                        className="border border-white mb-2 rounded-md self-end w-max px-2 text-white py-2 disabled:opacity-50 font-quicksand"
                      >
                        Add to cart
                      </button>
                    </div>
                  </form>
                </div>

                <div className="w-full px-6 pb-6 xl:flex flex-col justify-between hidden">
                  <div className="flex justify-end pt-3 pb-2">
                    <p
                      className="text-right ml-4 w-1/4 hover:cursor-pointer"
                      onClick={() => setShowModal(false)}
                    >
                      X
                    </p>
                  </div>
                  <div className="flex flex-row justify-between gap-4 w-full">
                    <div className="flex flex-col w-2/3 min-w-[66%] justify-center">
                      <div className="relative mt-2 scrollbar-hide flex  overflow-scroll w-full sm:h-[664px]">
                        {item.images.map((image: any, i: number) => (
                          <div
                            key={i}
                            className={`${
                              imgIndex === i ? "block" : "hidden"
                            } w-full object-contain max-h-[242px] sm:max-h-[664px]`}
                          >
                            <img
                              src={image}
                              className="w-full h-full object-contain max-h-[242px] sm:max-h-[664px] rounded-sm"
                            />
                          </div>
                        ))}
                        {imgIndex > 0 && (
                          <div className="absolute top-1/2 left-0 transform -translate-y-1/2 ml-2">
                            <button
                              className="bg-gray-800 hover:bg-gray-600 hover:cursor-pointer rounded-full"
                              onClick={handleLeftClick}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 19l-7-7 7-7"
                                />
                              </svg>
                            </button>
                          </div>
                        )}
                        {imgIndex < item.images.length - 1 && (
                          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 mr-2">
                            <button
                              className="bg-gray-800 hover:bg-gray-600 hover:cursor-pointer rounded-full"
                              onClick={handleRightClick}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col max-w-1/3">
                      <Dialog.Title
                        as="h3"
                        className="text-lg self-end text-right font-medium leading-6 text-white mb-"
                      >
                        {item.name}
                      </Dialog.Title>{" "}
                      <form
                        onSubmit={handleSubmit}
                        className="flex flex-col justify-start items-center sm:py-2 min-w-max"
                      >
                        <p className="self-end text-right text-gray-200 ">
                          {item.price / 1000000} ₳
                        </p>
                        {item.original_price !== item.price ? (
                          <p className="self-end text-right text-gray-200 line-through opacity-75 mb-2">
                            {item.original_price / 1000000} ₳
                          </p>
                        ) : (
                          ""
                        )}
                        <div className="flex flex-col xl:flex-row self-end mt-4">
                          {item &&
                            item.variants &&
                            item.variants[0].size === "OneSize" && (
                              <div className="flex flex-row pr-4">
                                <div className="pr-2 font-quicksand self-center hidden">
                                  Quantity
                                </div>
                                <select
                                  autoFocus
                                  className={`pl-2 bg-[#0d0d0d] hover:cursor-pointer font-quicksand focus:outline-none text-sm`}
                                  value={quantity}
                                  onChange={(e) =>
                                    setQuantity(parseInt(e.target.value))
                                  }
                                >
                                  <>
                                    {Array.from(
                                      {
                                        length: Math.min(
                                          item.variants[0].stock,
                                          10
                                        ),
                                      },
                                      (_, i) => i + 1
                                    ).map((num) => (
                                      <option key={num} value={num}>
                                        {item &&
                                        item.variants &&
                                        num === item.variants[0].stock
                                          ? num + " left"
                                          : `${num}`}
                                      </option>
                                    ))}
                                  </>
                                </select>
                              </div>
                            )}
                          <select
                            autoFocus
                            disabled={
                              item &&
                              item.variants &&
                              item.variants[0].size === "OneSize"
                            }
                            className={`${
                              item &&
                              item.variants &&
                              item.variants[0].size === "OneSize" &&
                              "hidden "
                            } pr-4 py-2 bg-[#0d0d0d] hover:cursor-pointer font-quicksand focus:outline-none self-center sm:mr-4 ${
                              err && " rounded-lg text-red-400"
                            }`}
                            value={size}
                            onChange={handleSizeChange}
                          >
                            {item &&
                            item.variants &&
                            item.variants[0].size === "OneSize" ? (
                              <option value="OneSize">One Size</option>
                            ) : (
                              <>
                                <option value="" disabled>
                                  Size
                                </option>
                                {item &&
                                  item.variants &&
                                  item.variants.map((variant: any) => (
                                    <option
                                      key={variant.size}
                                      value={variant.size}
                                      disabled={variant.stock === 0}
                                    >
                                      {variant.size}
                                    </option>
                                  ))}
                              </>
                            )}
                          </select>
                          <button
                            disabled={err}
                            type="submit"
                            className="border border-white mb-2 rounded-md self-center w-max px-2 text-white py-2 disabled:opacity-50 font-quicksand"
                          >
                            Add to cart
                          </button>
                        </div>
                      </form>
                      <div className="pt-4 self-center pb-4 ">
                        Description
                        <p className="mt-1 whitespace-normal overflow-scroll scrollbar-hide text-sm text-gray-400">
                          {item.description}
                        </p>
                        {item.additional_info && (
                          <div className="mt-4">
                            Additional Info{" "}
                            <div
                              className="mt-1 max-w-screen whitespace-normal overflow-scroll scrollbar-hide text-sm text-gray-400 ease-in duration-500 flex flex-col gap-2"
                              dangerouslySetInnerHTML={{
                                __html: item.additional_info,
                              }}
                            />
                          </div>
                        )}
                      </div>
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
