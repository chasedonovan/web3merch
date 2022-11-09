import React, { useEffect } from "react";
import { useMerchContext } from "hooks/useMerchContext";

type Variant = {
  variant_id: string;
  size: string;
  stock: number;
};

type Item = {
  name: string;
  variant: Variant;
  quantity: number;
  variant_id: string;
};

type Props = {
  item: Item;
};

const CartCard = ({ item }: Props) => {
  const [size, setSize] = React.useState("");
  const [quantity, setQuantity] = React.useState(1);
  const { products, cart, setCart } = useMerchContext();
  const [product, setProduct] = React.useState<any>({
    name: "",
    price: 0,
    original_price: 0,
    image: "",
    images: [],
    description: "",
    additional_info: "",
    weight: "",
    variants: [],
    variant: {},
  } as any);

  useEffect(() => {
    const product = products.find((p) => p.name === item.name);
    if (product) {
      setProduct({
        ...product,
        variant: product.variants.find((v) => v.size === item.variant.size),
      });
    }
  }, [products, item.name]);

  useEffect(() => {
    setSize(item.variant.size);
  }, []);

  useEffect(() => {
    setQuantity(item.quantity);
  }, [item.quantity]);

  const removeItem = () => {
    //remove item from cart by variant_id
    const newCart = { ...cart };
    newCart.cartItems = newCart.cartItems.filter(
      (cartItem) => cartItem.variant_id !== item.variant_id
    );
    setCart(newCart);
  };

  const handleSizeChange = (e: any) => {
    setSize(e.target.value);
    const newCart = cart.cartItems.map((p) => {
      if (p.variant_id === item.variant_id) {
        return {
          ...p,
          variant: product.variants.find((v: any) => v.size === e.target.value),
          variant_id: product.variants.find(
            (v: any) => v.size === e.target.value
          ).variant_id,
        };
      }
      return p;
    });
    setCart({ ...cart, cartItems: newCart });
  };

  // const newCart = cart.cartItems.map((p) => {
  //   if (p.name === item.name) {
  //     return {
  //       ...p,
  //       variant: product.variants.find(
  //         (variant: any) => variant.size === e.target.value
  //       ),
  //       quantity: 1,
  //     };
  //   }
  //   return p;
  // });
  // setCart({ ...cart, cartItems: newCart });

  // setSize(e.target.value);

  const handleQuantityChange = (e: any) => {
    setCart({
      ...cart,
      cartItems: cart.cartItems.map((p) => {
        if (
          p.variant.variant_id === item.variant.variant_id &&
          p.name === item.name
        ) {
          return {
            ...p,
            quantity: Number(e.target.value),
          };
        }
        return p;
      }),
    });
  };

  return (
    <div
      className={`relative flex flex-col w-full py-2 md:py-4 md:px-4 md:pr-6 border-b border-[#2C2D33]/50 ${
        product?.name === item.name &&
        product?.variants.find((variant: any) => variant.size === size)
          .stock === 0 &&
        " border-red-900"
      }`}
    >
      {
        //find matching product and if out of stock, render out of stock
        product?.name === item.name &&
          product?.variants.find((variant: any) => variant.size === size)
            .stock === 0 && (
            <p className=" top-1 self-center text-center text-xs md:text-sm pb-1 text-[#FF0000] min-w-max">
              Out of stock, please remove
              {product.variants.length > 1 && <> or change item size</>}.
            </p>
          )
      }
      <div className="flex flex-row gap-2 w-full min-w-min justify-between ">
        <div className="flex flex-row items-center gap-2 md:gap-6">
          <div className="flex flex-col items-center min-w-max">
            <img
              src={product?.image}
              alt=""
              className={`${
                product?.name === item.name &&
                product?.variants.find((variant: any) => variant.size === size)
                  .stock === 0 &&
                "opacity-50"
              } w-16 h-16 md:h-24 md:w-24 object-cover rounded-sm`}
            />
          </div>
          <div className="flex flex-col font-quicksand justify-start">
            <p
              className={`${
                product?.name === item.name &&
                product?.variants.find((variant: any) => variant.size === size)
                  .stock === 0 &&
                "text-gray-500"
              } mb-2 max-w-[164px] 2xl:max-w-[212px]`}
            >
              {item.name}
            </p>
            <div className="flex flex-col">
              <div
                className={`flex flex-row ${
                  item.variant.size === "OneSize" && "hidden"
                }`}
              >
                <div className="pr-2 self-center text-sm">Size</div>
                <select
                  autoFocus
                  disabled={item.variant.size === "OneSize"}
                  className={`self-center bg-black hover:cursor-pointer font-quicksand focus:outline-none text-sm`}
                  value={size}
                  onChange={handleSizeChange}
                >
                  {item.variant.size === "OneSize" ? (
                    <option value="OneSize">One Size</option>
                  ) : (
                    <>
                      <option value="" disabled>
                        Size
                      </option>
                      {product?.variants.map((variant: any) => (
                        <option
                          key={variant.size}
                          value={variant.size}
                          disabled={variant.stock === 0}
                        >
                          {variant.size}
                          {/* {variant.stock <= 20 &&
                            variant.stock > 0 &&
                            " (only " + variant.stock + " left)"} */}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>

              <div className="flex flex-row">
                <div
                  className={`pr-2 text-sm ${
                    product?.variant.stock === 0 && "hidden"
                  }`}
                >
                  Quantity
                </div>
                <select
                  autoFocus
                  disabled={product?.variant.stock === 0}
                  className={`${
                    product?.variant.stock === 0 && "hidden"
                  } bg-black hover:cursor-pointer font-quicksand focus:outline-none text-sm`}
                  value={quantity}
                  onChange={handleQuantityChange}
                >
                  {product?.variant.stock > 0 ? (
                    <>
                      <option key={1} value={1}>
                        {1 === product.variant.stock ? 1 + " left" : `${1}`}
                      </option>
                      {/* {product?.variants.length === 1 && (
                        <option disabled key={2} value="">
                          {product.variant.size + " ("}
                          {product.variant.stock} {"left)"}
                        </option>
                      )} */}
                    </>
                  ) : (
                    <option value={0}>Out of stock</option>
                  )}
                </select>
                {product.variants.length > 1 && item.variant.stock <= 20 && (
                <p className="md:block text-sm hidden font-quicksand text-gray-300 min-w-max">
                  {"( "}
                  {item.variant.stock} {"left)"}
                </p>
              )}
              </div>
              {product.variants.length === 1 && item.variant.stock <= 20 && (
                <p className="md:block text-sm hidden font-quicksand text-gray-300">
                  {"(only "}
                  {item.variant.stock} {"left)"}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between text-right ml-[2px] 2xl:ml-12 font-quicksand pt-3 min-w-max">
          <div className="flex flex-col-reverse 2xl:flex-row gap-2 items-center">
            {product.original_price !== product.price ? (
              <p
                className={`${
                  product?.name === item.name &&
                  product?.variants.find(
                    (variant: any) => variant.size === size
                  ).stock === 0 &&
                  "text-gray-500"
                } self-end text-right text-gray-200 line-through opacity-75`}
              >
                ${product.original_price}
              </p>
            ) : (
              ""
            )}
            <p
              className={`${
                product?.name === item.name &&
                product?.variants.find((variant: any) => variant.size === size)
                  .stock === 0 &&
                "text-gray-500"
              } self-end text-right text-gray-200 `}
            >
              ${product.price}
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
    </div>
  );
};

export default CartCard;
