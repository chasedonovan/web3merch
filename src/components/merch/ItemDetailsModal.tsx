import { Fragment, useRef, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

interface IFormInput {
  size: string;
}
type Props = {
  item: any;
  setShowModal: (showModal: boolean) => void;
  showModal: boolean;
  setCartItems: (cartItems: any) => void;
  cartItems: Array<any>;
  itemId: number;
  setItemId: (itemId: number) => void;
  setShowCart: (showCart: boolean) => void;
};

export default function ItemDetailsModal({
  setCartItems,
  cartItems,
  showModal,
  setShowModal,
  item,
  itemId,
  setItemId,
  setShowCart,
}: Props) {
  const cancelButtonRef = useRef(null);
  const [imgIndex, setImgIndex] = useState(0);
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const validationSchema = Yup.object().shape({
    size: Yup.string().required("Size is required"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<IFormInput>({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (item.variants[0].size === "OneSize") {
      setValue("size", item.variants[0].size);
    }
  }, [item.variants, setValue]);

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

  const onSubmit = (data: IFormInput) => {
    console.log(data);
    setCartItems([
      ...cartItems,
      {
        name: item.name,
        price: item.price,
        original_price: item.original_price,
        image: item.image,
        images: item.images,
        description: item.description,
        additional_info: item.additional_info,
        weight: item.weight,
        variants: item.variants,
        variant: item.variants.filter(
          (variant: any) => variant.size === data.size
        )[0],
        itemId: itemId,
        quantity: quantity,
      },
    ]);

    setItemId(itemId + 1);
    setTimeout(() => {
      if (cartItems.length === 0) {
        setShowCart(true);
      }
      setShowModal(false);
    }, 100);
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
              <Dialog.Panel className="ease-in duration-300 min-w-min min-h-min relative transform overflow-hidden rounded-md bg-[#0D0D0D] text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-[75%] border border-gray-600">
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
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col justify-start sm:gap-2 items-center sm:py-2 min-w-max"
                  >
                    {item.original_price !== item.price ? (
                      <p className="self-end text-right text-gray-200 line-through opacity-75">
                        {item.original_price} ₳
                      </p>
                    ) : (
                      ""
                    )}
                    <p className="self-end text-right text-gray-200 ">
                      {item.price} ₳
                    </p>
                    <div className="flex flex-col lg:flex-row justify-end ">
                      {item.variants[0].size === "OneSize" && (
                        <div className="flex flex-row">
                          <div className="pr-2 font-quicksand">Quantity</div>
                          <select
                            autoFocus
                            className={`pl-2 bg-[#0d0d0d] hover:cursor-pointer font-quicksand focus:outline-none text-sm mb-2`}
                            value={quantity}
                            onChange={(e) =>
                              setQuantity(parseInt(e.target.value))
                            }
                          >
                            <>
                              <option value="1" selected>
                                1
                              </option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5">5</option>
                              <option value="6">6</option>
                              <option value="7">7</option>
                              <option value="8">8</option>
                              <option value="9">9</option>
                              <option value="10">10</option>
                            </>
                          </select>
                        </div>
                      )}
                      <select
                        autoFocus
                        disabled={item.variants[0].size === "OneSize"}
                        className={`${
                          item.variants[0].size === "OneSize" && "hidden "
                        } pr-4 py-2 bg-[#0d0d0d] hover:cursor-pointer font-quicksand focus:outline-none self-end lg:mr-4 ${
                          errors.size && " rounded-lg text-red-400"
                        }`}
                        {...register("size")}
                      >
                        {item.variants[0].size === "OneSize" ? (
                          <option value="OneSize">One Size</option>
                        ) : (
                          <>
                            <option value="" disabled selected>
                              Size
                            </option>
                            {item.variants.map((variant: any) => (
                              <option key={variant.size} value={variant.size} disabled={variant.stock === 0}>
                                {variant.size}
                              </option>
                            ))}
                          </>
                        )}
                      </select>
                      <button
                        disabled={errors.size ? true : false}
                        type="submit"
                        className="border border-white mb-2 rounded-md self-center w-max px-2 text-white py-2 disabled:opacity-50 font-quicksand"
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
                        className="text-lg self-end text-right font-medium leading-6 text-white w-max mb-"
                      >
                        {item.name}
                      </Dialog.Title>{" "}
                      <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col justify-start sm:gap-2 items-center sm:py-2 min-w-max"
                      >
                        {item.original_price !== item.price ? (
                          <p className="self-end text-right text-gray-200 line-through opacity-75">
                            {item.original_price} ₳
                          </p>
                        ) : (
                          ""
                        )}
                        <p className="self-end text-right text-gray-200 ">
                          {item.price} ₳
                        </p>

                        <div className="flex flex-col xl:flex-row self-end mt-4">
                          {item.variants[0].size === "OneSize" && (
                            <div className="flex flex-row pr-4">
                              <div className="pr-2 font-quicksand self-center">
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
                                  <option value="1" selected>
                                    1
                                  </option>
                                  <option value="2">2</option>
                                  <option value="3">3</option>
                                  <option value="4">4</option>
                                  <option value="5">5</option>
                                  <option value="6">6</option>
                                  <option value="7">7</option>
                                  <option value="8">8</option>
                                  <option value="9">9</option>
                                  <option value="10">10</option>
                                </>
                              </select>
                            </div>
                          )}
                          <select
                            autoFocus
                            disabled={item.variants[0].size === "OneSize"}
                            className={`${
                              item.variants[0].size === "OneSize" && "hidden "
                            } pr-4 py-2 bg-[#0d0d0d] hover:cursor-pointer font-quicksand focus:outline-none self-center sm:mr-4 ${
                              errors.size && " rounded-lg text-red-400"
                            }`}
                            {...register("size")}
                          >
                            {item.variants[0].size === "OneSize" ? (
                              <option value="OneSize">One Size</option>
                            ) : (
                              <>
                                <option value="" disabled selected>
                                  Size
                                </option>
                                {item.variants.map((variant: any) => (
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
                            disabled={errors.size ? true : false}
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
