import React, { useEffect, useRef } from "react";
import Navbar from "components/merch/Navbar";
import ItemCard from "components/merch/ItemCard";
import CartCard from "components/merch/CartCard";
import MobileCart from "components/merch/MobileCart";
import CheckoutModal from "components/merch/CheckoutModal";
import { useWalletContext } from "../hooks/useWalletContext";
import { MerchConnectBtn } from "components/merch/MerchConnectBtn";
import { GlobalContextProvider } from "../hooks/useGlobalContext";
import { useMerchContext } from "hooks/useMerchContext";

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
  variants: any[];
  itemId: number;
  variant: any;
  quantity: number;
};

const GoatTribe = (props: Props) => {
  const { isConnected } = useWalletContext();
  const [cartOpen, setCartOpen] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [showCart, setShowCart] = React.useState(false);
  const [cartCount, setCartCount] = React.useState(0);
  const productSection = useRef<null | HTMLDivElement>(null);
  const { products, cart, setCart } = useMerchContext();

  useEffect(() => {
    let count = 0;
    cart.cartItems.forEach((item) => {
      count += item.quantity;
    });
    setCartCount(count);
  }, [cart.cartItems]);

  useEffect(() => {
    if (products.length > 0 && productSection.current) {
      productSection.current.scrollIntoView();
    }
  }, [products]);

  return (
    <div className="w-full h-full flex flex-col overflow-scroll scrollbar-hide min-h-max">
      <Navbar
        setCartOpen={setCartOpen}
        showCart={showCart}
        setShowCart={setShowCart}
        cartCount={cartCount}
      />
      {products.length > 0 && (
        <GlobalContextProvider>
          <div className="flex-1 text-white w-full h-full overflow-scroll scrollbar-hide">
            <div className="w-full h-full flex flex-row divide-x divide-[#2C2D33]/50">
              <div className=" sm:w-full h-full flex flex-col overflow-scroll scrollbar-hide min-w-[66%] justify-start">
                <div className="" ref={productSection}>
                  <img
                    id="logo"
                    src="/goat-logo.png"
                    className=" sm:h-[98px] 2xl:h-[164px] my-6 sm:my-12 mx-auto"
                  />
                </div>
                <div className="flex flex-row flex-wrap gap-16 self-center mx-auto px-1 justify-center max-w-[1600px]">
                  {products.map((item, i) => (
                    <ItemCard key={i} item={item} setShowCart={setShowCart} />
                  ))}
                </div>
              </div>
              {showCart && (
                <div className="hidden lg:flex flex-col w-[34%] h-full min-w-min">
                  <div className="w-full flex flex-row justify-between items-center border-b border-[#2C2D33]/50">
                    <div className="flex flex-col px-4 py-4 min-w-max">
                      <p className="text-xl font-saira">Subtotal:</p>
                      <p className="text-xl">
                        {cart.subTotalPrice / 1000000} ADA
                      </p>
                      <p className="text-gray-300 text-sm">+shipping 30 ADA</p>
                    </div>
                    <div className="flex flex-col px-4 py-4">
                      <button
                        disabled={cart.cartItems.length === 0}
                        className={`font-quicksand border border-white text-white px-8 py-4 rounded-md m-4 mx-2 ${
                          cart.cartItems.length === 0 &&
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
                  <div className="flex flex-col w-full overflow-scroll scrollbar-hide">
                    {cart.cartItems.length !== 0 &&
                      cart.cartItems.map((item, i) => (
                        <CartCard key={i} item={item} />
                      ))}
                  </div>
                </div>
              )}

              {cartOpen && (
                <MobileCart
                  setCartOpen={setCartOpen}
                  cartOpen={cartOpen}
                  setShowModal={setShowModal}
                />
              )}
            </div>
          </div>
          {showModal && (
            <CheckoutModal setShowModal={setShowModal} showModal={showModal} />
          )}
        </GlobalContextProvider>
      )}

      {!isConnected && (
        <div className="min-h-[298px] flex-1 text-white w-full h-full flex flex-col items-center justify-center px-[5%] pb-[10%] ">
          <img
            src="/goat-logo.png"
            className=" h-16 md:h-[124px] mb-2 sm:mb-12 mx-auto sm:mt-24 self-center"
          />
          <MerchConnectBtn />
        </div>
      )}
    </div>
  );
};

export default GoatTribe;
