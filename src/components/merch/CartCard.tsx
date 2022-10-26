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
};

type Props = {
  item: Item;

};

const CartCard = (props: Props) => {
  const [size, setSize] = React.useState("");
  const [quantity, setQuantity] = React.useState(1);
  const [stock, setStock] = React.useState(10);
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
  } as any);

  useEffect(() => {
    const product = products.find((p) => p.name === props.item.name);
    if (product) {
      setProduct(product);
    }
  }, [products, props.item.name]);


  useEffect(() => {
    setSize(props.item.variant.size);
    setStock(props.item.variant.stock);
  }, []);

  useEffect(() => {
    setQuantity(props.item.quantity);
  }, [props.item.quantity]);

  const removeItem = () => {
    const newCart = cart.cartItems.filter((item) => item.name !== props.item.name);
    setCart({ ...cart, cartItems: newCart });
  };

  const handleSizeChange = (e: any) => {
    const newCart = cart.cartItems.map((item) => {
      if (item.name === props.item.name) {
        return {
          ...item,
          variant: product.variants.find((variant: any) => variant.size === e.target.value),
          quantity: 1,
        };
      }
      return item;
    });
    setCart({ ...cart, cartItems: newCart });

    setSize(e.target.value);

  };

  const handleQuantityChange = (e: any) => {
    setCart({
      ...cart,
      cartItems: cart.cartItems.map((item) => {
        if (item.variant.variant_id === props.item.variant.variant_id && item.name === props.item.name) {
          return {
            ...item,
            quantity: Number(e.target.value),
          };
        }
        return item;
      }
      ),
    });
  }


  return (
    <div className="flex flex-row gap-2 w-full min-w-min justify-between py-2 md:py-4 md:px-4 md:pr-6 border-b border-[#2C2D33]/50 ">
      <div className="flex flex-row items-center gap-2 md:gap-6">
        <div className="flex flex-col items-center min-w-max">
          <img
            src={product.image}
            alt="item"
            className="w-16 h-16 md:h-24 md:w-24 object-cover rounded-sm"
          />
        </div>
        <div className="flex flex-col font-quicksand justify-start">
          <p className=" mb-2 max-w-[164px] 2xl:max-w-[212px]">
            {props.item.name}
          </p>
          <div className="flex flex-col">
            <div className="flex flex-row">
              <div className="pr-2 self-center text-sm">Size</div>
              <select
                autoFocus
                disabled={props.item.variant.size === "OneSize"}
                className={`self-center bg-black hover:cursor-pointer font-quicksand focus:outline-none text-sm`}
                value={size}
                onChange={handleSizeChange}
              >
                {props.item.variant.size === "OneSize" ? (
                  <option value="OneSize">One Size</option>
                ) : (
                  <>
                    <option value="" disabled>
                      Size
                    </option>
                    {product.variants.map((variant: any) => (
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
            </div>
            <div className="flex flex-row">
              <div className="pr-2 text-sm">Quantity</div>
              <select
                autoFocus
                className={`pl-2 bg-black hover:cursor-pointer font-quicksand focus:outline-none text-sm`}
                value={quantity}
                onChange={handleQuantityChange}
              >
                <>
                  {Array.from(
                    { length: Math.min(props.item.variant.stock, 100) },
                    (_, i) => i + 1
                  ).map((num) => (
                    <option key={num} value={num}>
                      {num === props.item.variant.stock
                        ? num + " left"
                        : `${num}`}
                    </option>
                  ))}
                </>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between text-right ml-4 2xl:ml-12 font-quicksand pt-3 min-w-max">
        <div className="flex flex-col-reverse 2xl:flex-row gap-2 items-center">
          {product.original_price !== product.price ? (
            <p className="self-end text-right text-gray-200 line-through opacity-75">
              {product.original_price / 1000000} ₳
            </p>
          ) : (
            ""
          )}
          <p className="self-end text-right text-gray-200 ">
            {product.price / 1000000} ₳
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
