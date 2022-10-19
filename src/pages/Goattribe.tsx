import React, { useEffect } from "react";
import Navbar from "components/merch/Navbar";
import ItemCard from "components/merch/ItemCard";
import CartCard from "components/merch/CartCard";
import MobileCart from "components/merch/MobileCart";
import CheckoutModal from "components/merch/CheckoutModal";
import { useWalletContext } from "../hooks/useWalletContext";
import { MerchConnectBtn } from "components/merch/MerchConnectBtn";
import { GlobalContextProvider } from "../hooks/useGlobalContext";

const merchItems = [
  {
    name: "GOAT Tribe Merchandise Bundle",
    price: 240 /*82*/,
    original_price: 280,
    image: "/merch/goat/1-bundle1.png",
    images: ["/merch/goat/1-bundle1.png"],
    description:
      "A discounted bundle of the finest GOAT Tribe merchandise including our signature Bella + Canvas hoodie, logo dad hat and sticker packs.",
    additional_info: "",
    weight: "0.75kg",
    sizes: ["M", "L", "XL", "XXL"],
  },
  {
    name: "GOAT Tribe x Bella + Canvas Hoodie",
    price: 165 /*57*/,
    original_price: 165,
    image: "/merch/goat/2-hoodie1.jpg",
    images: [
      "/merch/goat/2-hoodie1.jpg",
      "/merch/goat/2-hoodie2.jpg",
      "/merch/goat/2-hoodie3.jpg",
      "/merch/goat/2-hoodie4.jpg",
    ],
    description:
      "A remarkably soft unisex pullover hoodie with a loose fit, made by Bella x Canvas, featuring the GOAT Tribe logo and back print.",
    additional_info:
      "<p>The GOAT Tribe hoodie is a remarkably soft unisex pullover hoodie with a loose fit, made by the impeccable Bella + Canvas. Spun from plush polycotton, the hoodie features an up-to-date fit, hood with black drawcords, kangaroo pocket, ribbed cuffs and waistband.</p> <p>Fabrication: 52% Airlume combed and ring-spun cotton, 48% polyester fleece, 32 single 8.0 oz.</p>  <p>For sizing and more information, visit the Bella + Canvas product page here.</p>",
    weight: "0.45kg",
    sizes: ["M", "L", "XL", "XXL"],
  },
  {
    name: "Logo Retro Trucker Hat",
    price: 75,
    original_price: 75,
    image: "/merch/goat/3-hat.png",
    images: ["/merch/goat/3-hat.png"],
    description:
      "A high quality black Yupoong 6606 retro trucker hat featuring the GOAT Tribe logo lovingly embroidered on the front.",
    additional_info: "",
    weight: "0.18kg",
    sizes: ["OneSize"],
  },
  {
    name: "Think Freud Retro Trucker Hat",
    price: 75,
    original_price: 75,
    image: "/merch/goat/4-hat.png",
    images: ["/merch/goat/4-hat.png"],
    description:
      "A high quality black Yupoong 6606 retro trucker hat featuring the GOAT Tribe ‘Think Freud’ logo lovingly embroidered on the front.",
    additional_info: "",

    weight: "0.18kg",
    sizes: ["OneSize"],
  },
  {
    name: "Vinyl Sticker Collection 1",
    price: 20,
    original_price: 20,
    image: "/merch/goat/5-sticker1.png",
    images: [
      "/merch/goat/5-sticker1.png",
      "/merch/goat/5-sticker2.png",
      "/merch/goat/5-sticker3.png",
      "/merch/goat/5-sticker4.png",
      "/merch/goat/5-sticker5.png",
      "/merch/goat/5-sticker6.png",
      "/merch/goat/5-sticker7.png",
    ],
    description:
      "A set of 5 die-cut gloss vinyl stickers featuring exclusive GOATs.",
    additional_info: "",

    weight: "0.05kg",
    sizes: ["OneSize"],
  },
  {
    name: "Vinyl Sticker Collection 2",
    price: 20,
    original_price: 20,
    image: "/merch/goat/6-sticker1.png",
    images: [
      "/merch/goat/6-sticker1.png",
      "/merch/goat/6-sticker2.png",
      "/merch/goat/6-sticker3.png",
      "/merch/goat/6-sticker4.png",
      "/merch/goat/6-sticker5.png",
      "/merch/goat/6-sticker6.png",
      "/merch/goat/6-sticker7.png",
    ],
    description:
      "A set of 5 die-cut gloss vinyl stickers featuring exclusive GOATs.",
    additional_info: "",

    weight: "0.05kg",
    sizes: ["OneSize"],
  },
];

type Props = {};

type CartItem = {
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

const GoatTribe = (props: Props) => {
  const { isConnected } = useWalletContext();
  const [cartOpen, setCartOpen] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [showCart, setShowCart] = React.useState(true);
  const [total, setTotal] = React.useState(0);
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);
  const [itemId, setItemId] = React.useState(0);
  const [cartCount, setCartCount] = React.useState(0);

  useEffect(() => {
    if (cartItems) {
      setTotal(cartItems.reduce((acc, item) => acc + item.price, 0));
    }
    setCartCount(cartItems.length);
  }, [cartItems]);

  return (
    <div className="w-full h-full flex flex-col overflow-scroll scrollbar-hide">
      <Navbar
        setCartOpen={setCartOpen}
        showCart={showCart}
        setShowCart={setShowCart}
        cartCount={cartCount}
      />
      {isConnected && (
        <GlobalContextProvider>
          <div className="flex-1 text-white w-full h-full overflow-scroll scrollbar-hide">
            <div className="w-full h-full flex flex-row items-center divide-x divide-[#2C2D33]">
              <div className=" sm:w-full h-full flex flex-col overflow-scroll scrollbar-hide min-w-[66%]">
                <div className="">
                  <img
                    src="/goat-logo.png"
                    className=" sm:h-[164px] my-4 sm:my-12 mx-auto"
                  />
                </div>
                <div className="flex flex-row flex-wrap gap-16 self-center mx-auto px-1 justify-center max-w-[1600px]">
                  {merchItems.map((item, i) => (
                    <ItemCard
                      key={i}
                      item={item}
                      itemId={itemId}
                      setItemId={setItemId}
                      cartItems={cartItems}
                      setCartItems={setCartItems}
                    />
                  ))}
                </div>
              </div>
              {showCart && (
                <div className="hidden lg:flex flex-col w-[34%] h-full min-w-min">
                  <div className="w-full flex flex-row justify-between items-center border-b border-[#2C2D33]">
                    <div className="flex flex-col px-4 py-4 min-w-max">
                      <p className="text-xl font-saira">Subtotal:</p>
                      <p className="text-xl">{total} ADA</p>
                      <p className="text-gray-300 text-sm">+shipping 30 ADA</p>
                    </div>
                    <div className="flex flex-col px-4 py-4">
                      <button
                        disabled={cartItems.length === 0}
                        className={`font-quicksand border border-white text-white px-8 py-4 rounded-md m-4 mx-2 ${
                          cartItems.length === 0 && "opacity-50 cursor-default"
                        }`}
                        onClick={() => {
                          setShowModal(true);
                        }}
                      >
                        Checkout
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col w-full overflow-scroll scrollbar-hide">
                    {cartItems.length !== 0 &&
                      cartItems.map((item, i) => (
                        <CartCard
                          key={i}
                          item={item}
                          cartItems={cartItems}
                          setCartItems={setCartItems}
                        />
                      ))}
                  </div>
                </div>
              )}

              {cartOpen && (
                <MobileCart
                  setCartOpen={setCartOpen}
                  cartOpen={cartOpen}
                  cartItems={cartItems}
                  setCartItems={setCartItems}
                  total={total}
                  setShowModal={setShowModal}
                />
              )}
            </div>
          </div>
          {showModal && (
            <CheckoutModal
              setShowModal={setShowModal}
              showModal={showModal}
              cartItems={cartItems}
            />
          )}
        </GlobalContextProvider>
      )}

      {!isConnected && (
        <div className="flex-1 text-white w-full h-full flex flex-col items-center justify-center pb-[20%]">
          <img
            src="/goat-logo.png"
            className=" h-16 sm:h-[124px] mb-2 sm:mb-12 mx-auto"
          />
          <MerchConnectBtn />
        </div>
      )}
    </div>
  );
};

export default GoatTribe;
