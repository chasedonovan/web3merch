import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import ItemDetailsModal from "./ItemDetailsModal";

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
  itemId: number;
  setItemId: (itemId: number) => void;
  setCartItems: (cartItems: any) => void;
  setShowCart: (showCart: boolean) => void;
  cartItems: Array<{
    name: string;
    price: number;
    original_price: number;
    image: string;
    images: string[];
    description: string;
    additional_info: string;
    weight: string;
    itemId: number;
    variants: Variant[];
    variant: Variant;
    quantity: number;
  }>;
};

const ItemCard = (props: Props) => {
  const [showDetails, setShowDetails] = React.useState(false);
  const validationSchema = Yup.object().shape({
    size: Yup.string().required("Size is required"),
  });
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (props.item.variants[0].size === "OneSize") {
      setValue("size", props.item.variants[0].size);
    }
  }, [props.item.variants, setValue]);

  const onSubmit = (data: IFormInput) => {
    console.log(data);

    // Check if item variant is already in car, if so, increase quantity
    const itemInCart = props.cartItems.find(
      (item) => item.variant.size === data.size && item.name === props.item.name
    );

    if (itemInCart) {
      props.setCartItems(
        props.cartItems.map((item) => {
          if (item.name === props.item.name && item.variant.size === data.size) {
            item.quantity += 1;
          }
          return item;
        })
      );
    } else {
    props.setCartItems([
      ...props.cartItems,
      {
        name: props.item.name,
        price: props.item.price,
        original_price: props.item.original_price,
        image: props.item.image,
        images: props.item.images,
        description: props.item.description,
        additional_info: props.item.additional_info,
        weight: props.item.weight,
        variants: props.item.variants,
        variant: props.item.variants.filter(
          (variant) => variant.size === data.size
          )[0],
        itemId: props.itemId,
        quantity: 1,
      },
    ]);
  }
    if (props.cartItems.length === 0) {
      props.setShowCart(true);
    }
    props.setItemId(props.itemId + 1);
  };

  return (
    <div className="w-max h-max flex flex-col hover:scale-105 ease-in duration-300 mb-2 max-w-64 sm:min-w-[386px] ">
      <img
        src={props.item.image}
        alt="item"
        className="w-64 h-64 sm:w-96 sm:h-96 object-cover rounded-t-sm self-center cursor-pointer"
        onClick={() => setShowDetails(true)}
      />
      <div className="py-2 w-full flex flex-row items-center justify-between h-16">
        <p className="text-lg font-quicksand font-semibold max-w-[184px] md:max-w-[212px]">
          {props.item.name}
        </p>
        <div className="flex flex-col-reverse sm:flex-row sm:gap-2 items-center">
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
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-row justify-end gap-6 items-center py-2"
      >
        <select
          autoFocus
          disabled={props.item.variants[0].size === "OneSize"}
          className={`pr-4 mb-2 py-2 bg-black hover:cursor-pointer font-quicksand focus:outline-none ${
            errors.size && "border rounded-lg border-red-600"
          }`}
          {...register("size")}
        >
          {props.item.variants[0].size === "OneSize" ? (
            <option value="OneSize">One Size</option>
          ) : (
            <>
              <option value="" disabled selected>
                Size
              </option>
              {props.item.variants.map((variant) => (
                <option key={variant.size} value={variant.size}>
                  {variant.size}
                </option>
              ))}
            </>
          )}
        </select>
        <button
          disabled={errors.size ? true : false}
          type="submit"
          className="border border-white mb-2 rounded-md self-center w-1/3 text-white py-2 disabled:opacity-50 font-quicksand"
        >
          Add to cart
        </button>
      </form>
      {showDetails && (
        <ItemDetailsModal
          setShowModal={setShowDetails}
          showModal={showDetails}
          item={props.item}
          setCartItems={props.setCartItems}
          cartItems={props.cartItems}
          setItemId={props.setItemId}
          itemId={props.itemId}
          setShowCart={props.setShowCart}
        />
      )}
    </div>
  );
};

export default ItemCard;
