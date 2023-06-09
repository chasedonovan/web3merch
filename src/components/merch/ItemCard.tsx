import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import ItemDetailsModal from "./ItemDetailsModal";
import { useMerchContext } from "hooks/useMerchContext";

interface IFormInput {
  size: string;
}

type Variant = {
  variant_id: string;
  size: string;
  stock: number;
};

type Item = {
  name: string;
  price: number;
  original_price: number;
  image: string;
  images: string[];
  description: string;
  additional_info: string;
  weight: string;
  variants: Variant[];
};

type Props = {
  item: Item;
  setShowCart: (showCart: boolean) => void;
};

const ItemCard = (props: Props) => {
  const { cart, setCart, setAddedModal, setMaxModal } = useMerchContext();
  const [showDetails, setShowDetails] = React.useState(false);
  const [quantity, setQuantity] = React.useState(1);
  const validationSchema = Yup.object().shape({
    size: Yup.string().required("Size is required"),
  });
  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(validationSchema),
  });
  const size = watch("size", "default");

  useEffect(() => {
    if (
      props.item &&
      props.item.variants &&
      props.item.variants[0].size === "OneSize"
    ) {
      setValue("size", props.item.variants[0].size);
    }
  }, [props.item.variants, setValue]);

  const onSubmit = (data: IFormInput) => {
    //limit quantity to 1 per product
    const itemInCart = cart.cartItems.find(
      (item) => item.name === props.item.name
    );

    if (itemInCart) {
      setMaxModal(true);
    } else {
      // Add item to cart
      const variant = props.item.variants.find(
        (variant) => variant.size === data.size
      );
      const newCartItem = {
        name: props.item.name,
        variant: variant,
        quantity: quantity,
        price: props.item.price,
        variant_id: variant ? variant.variant_id : "",
      };
      setCart({
        ...cart,
        cartItems: [...cart.cartItems, newCartItem],
      });
      setAddedModal(true);
    }
    setQuantity(1);
  };
  return (
    <div className="w-max h-max flex flex-col hover:scale-105 ease-in duration-300 mb-2 max-w-64 sm:min-w-[386px] ">
      <img
        src={props.item.image}
        alt="item"
        className="w-64 h-64 sm:w-96 sm:h-96 object-cover rounded-t-sm self-center cursor-pointer"
        onClick={() => setShowDetails(true)}
      />
      <div
        className="py-2 w-full flex flex-row items-center justify-between h-16 hover:cursor-pointer"
        onClick={() => setShowDetails(true)}
      >
        <p className="text-lg font-quicksand font-semibold max-w-[184px] md:max-w-[212px]">
          {props.item.name}
        </p>
        <div className="flex flex-col-reverse sm:flex-row sm:gap-2 items-center">
          {props.item.original_price !== props.item.price ? (
            <p className="self-end text-right text-gray-200 line-through opacity-75">
              ${props.item.original_price}
            </p>
          ) : (
            ""
          )}
          <p className="self-end text-right text-gray-200 ">
            ${props.item.price}
          </p>
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-row justify-end gap-6 items-center py-2"
      >
        {props.item &&
          props.item.variants &&
          props.item.variants[0].size === "OneSize" && (
            <div className="flex flex-row">
              <div
                className={`pr-2 font-quicksand ${
                  props.item.variants[0].stock === 0 && "hidden"
                }`}
              >
                Quantity 
                {props.item.variants[0].stock <= 20 && (
              <p className="block text-sm md:hidden font-quicksand text-gray-300 self-center">
                      {"("}
                      {props.item.variants[0].stock} {"left)"}
              </p>
            )}
              </div>
              <select
                disabled={props.item.variants[0].stock === 0}
                autoFocus
                className={`pl-2 bg-black hover:cursor-pointer font-quicksand focus:outline-none text-sm`}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
              >
                {props.item.variants[0].stock > 0 ? (
                  <>
                    <option key={1} value={1}>
                      {1 === props.item.variants[0].stock
                        ? 1 + " left"
                        : `${1}`}
                    </option>
                  </>
                ) : (
                  <option value={0}>Out of stock</option>
                )}
              </select>
            {props.item.variants[0].stock <= 20 && (
              <p className="hidden md:block text-sm pl-2 font-quicksand text-gray-300 self-center">
                      {"("}
                      {props.item.variants[0].stock} {"left)"}
              </p>
            )}
            </div>
          )}
        <select
          autoFocus
          disabled={
            props.item &&
            props.item.variants &&
            props.item.variants[0].size === "OneSize"
          }
          className={`${
            props.item &&
            props.item.variants &&
            props.item.variants[0].size === "OneSize" &&
            "hidden"
          } pr-4 mb-2 py-2 bg-black hover:cursor-pointer font-quicksand focus:outline-none ${
            errors.size && "border rounded-lg border-red-600"
          }`}
          {...register("size")}
          defaultValue=""
        >
          {props.item &&
          props.item.variants &&
          props.item.variants[0].size === "OneSize" ? (
            <option value="OneSize">One Size</option>
          ) : (
            <>
              <option value="" disabled>
                Size
              </option>
              {/* sort by variant id */}
              {props.item &&
                props.item.variants &&
                props.item.variants.sort((a, b) => parseInt(a.variant_id) - parseInt(b.variant_id)).map((variant) => (
                    <option
                      key={variant.size}
                      value={variant.size}
                      disabled={variant.stock === 0}
                    >
                      {variant.size}
                      {/* {variant.stock > 20 && " (20+ in stock)"} */}
                      {variant.stock <= 20 &&
                        variant.stock > 0 &&
                        " (" + variant.stock + " left)"}
                      {variant.stock === 0 && " (sold out)"}
                    </option>
                  ))                }
                
                
            </>
          )}
        </select>
        {/* If the item is out of stock at selected size, disable the button */}
        <button
          disabled={
            errors.size
              ? true
              : false ||
                (props.item.variants[0].stock === 0 &&
                  props.item.variants[0].size === "OneSize") ||
                props.item.variants.find((variant) => variant.size === size)
                  ?.stock === 0
          }
          type="submit"
          className="border border-white mb-2 rounded-md self-center w-1/3 text-white py-2 px-1 min-w-max disabled:opacity-50 font-quicksand"
        >
          Add to cart
        </button>
      </form>
      {showDetails && (
        <ItemDetailsModal
          setShowModal={setShowDetails}
          showModal={showDetails}
          item={props.item}
          setShowCart={props.setShowCart}
        />
      )}
    </div>
  );
};

export default ItemCard;
