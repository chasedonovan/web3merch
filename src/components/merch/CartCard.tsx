import React, { useEffect } from "react";

type Item = {
  name: string;
  price: number;
  original_price: number;
  image: string;
  images: string[];
  description: string;
  additional_info: string;
  weight: string;
  sizes: string[];
  itemId: number;
  size: string;
};

type Props = {
  item: Item;
  setCartItems: (cartItems: any) => void;
  cartItems: Array<Item>;
};

const CartCard = (props: Props) => {
  const [size, setSize] = React.useState("");

  useEffect(() => {
    setSize(props.item.size);
  }, []);

  const removeItem = () => {
    props.setCartItems(
      props.cartItems.filter((item) => item.itemId !== props.item.itemId)
    );
  };

  const handleSizeChange = (e: any) => {
    setSize(e.target.value);
    props.setCartItems(
      props.cartItems.map((item) => {
        if (item.itemId === props.item.itemId) {
          item.size = e.target.value;
        }
        return item;
      })
    );
  };

  return (
    <div className="flex flex-row gap-2 w-full min-w-min justify-between py-2 md:py-4 md:px-4 md:pr-6 border-b border-[#2C2D33] ">
      <div className="flex flex-row items-center gap-2 md:gap-6">
        <div className="flex flex-col items-center min-w-max">
          <img
            src={props.item.image}
            alt="item"
            className="w-16 h-16 md:h-24 md:w-24 object-cover rounded-sm"
          />
        </div>
        <div className="flex flex-col font-quicksand justify-start">
          <p className=" mb-2 max-w-[164px] 2xl:max-w-[212px]">
            {props.item.name}
          </p>
          <div className="flex flex-row">
            <div className="pr-2 py-2">Size</div>
            <select
              autoFocus
              disabled={props.item.sizes[0] === "OneSize"}
              className={`pr-2 mb-2 mt-2 bg-black hover:cursor-pointer font-quicksand focus:outline-none `}
              value={size}
              onChange={handleSizeChange}
            >
              {props.item.sizes[0] === "OneSize" ? (
                <option value="OneSize">One Size</option>
              ) : (
                <>
                  <option value="" disabled selected>
                    Size
                  </option>
                  {props.item.sizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between text-right ml-4 2xl:ml-12 font-quicksand pt-3 min-w-max">
        <div className="flex flex-col-reverse 2xl:flex-row gap-2 items-center">
          {props.item.original_price !== props.item.price ? (
            <p className="self-end text-right text-gray-200 line-through opacity-75">
              {props.item.original_price} ₳
            </p>
          ) : (
            ""
          )}
          <p className="self-end text-right text-gray-200 ">
            {props.item.price} ₳
          </p>
        </div>
        <svg
          onClick={removeItem}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 self-end hover:cursor-pointer"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
          />
        </svg>
      </div>
    </div>
  );
};

export default CartCard;
