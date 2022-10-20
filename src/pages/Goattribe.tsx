import React, { useEffect, useRef } from "react";
import Navbar from "components/merch/Navbar";
import ItemCard from "components/merch/ItemCard";
import CartCard from "components/merch/CartCard";
import MobileCart from "components/merch/MobileCart";
import CheckoutModal from "components/merch/CheckoutModal";
import { useWalletContext } from "../hooks/useWalletContext";
import { MerchConnectBtn } from "components/merch/MerchConnectBtn";
import { GlobalContextProvider } from "../hooks/useGlobalContext";


type Props = {};

type Variant = {
  variant_id: string;
  size: string;
  stock: number;
};


type CartItem = {
  name: string;
  price: number;
  original_price: number;
  image: string;
  images: string[];
  description: string;
  additional_info: string;
  weight: string;
  variants: Variant[];
  itemId: number;
  variant: Variant;
  quantity: number;
};

const GoatTribe = (props: Props) => {
  const { isConnected } = useWalletContext();
  const [cartOpen, setCartOpen] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [showCart, setShowCart] = React.useState(false);
  const [total, setTotal] = React.useState(0);
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);
  const [itemId, setItemId] = React.useState(0);
  const [cartCount, setCartCount] = React.useState(0);
  const [merchItems, setMerchItems] = React.useState<any[]>([]);
  const productSection = useRef<null | HTMLDivElement>(null); 




  useEffect(() => {
    if (cartItems) {
      setTotal(cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0));
    }
    setCartCount(cartItems.length);
  }, [cartItems]);

  useEffect(() => {
    if (isConnected && productSection.current) {
      productSection.current.scrollIntoView();
    }
  }, [isConnected]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setMerchItems(data);
      });
  }, []);

  return (
    <div className="w-full h-full flex flex-col overflow-scroll scrollbar-hide min-h-max">
      <Navbar
        setCartOpen={setCartOpen}
        showCart={showCart}
        setShowCart={setShowCart}
        cartCount={cartCount}
      />
      {isConnected && (
        <GlobalContextProvider>
          <div className="flex-1 text-white w-full h-full overflow-scroll scrollbar-hide">
            <div className="w-full h-full flex flex-row divide-x divide-[#2C2D33]">
              <div className=" sm:w-full h-full flex flex-col overflow-scroll scrollbar-hide min-w-[66%] justify-start"
              >
                <div className=""
                ref={productSection}>
                  <img
                    id='logo'
                    src="/goat-logo.png"
                    className=" sm:h-[98px] 2xl:h-[164px] my-6 sm:my-12 mx-auto"
                    
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
                      setShowCart={setShowCart}
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
              total={total}
            />
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
