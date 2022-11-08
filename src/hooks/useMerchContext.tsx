import {
  createContext,
  PropsWithChildren,
  useState,
  useContext,
  useEffect,
} from "react";
//only get products when user isConnected
import { useWalletContext } from "./useWalletContext";

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

type CartItem = {
  name: string;
  variant: any;
  quantity: number;
  price: number;
  variant_id: string;
};

type Cart = {
  cartUuid: string;
  transactionId: string;
  payToAddress: string;
  cartItems: CartItem[];
  subTotalPrice: number;
  shippingPrice: number;
  totalPrice: number;
  paymentMethod: string;
  estimatedTotal: number;
  estimatedCurrency: string;
};

type Address = {
  first_name: string;
  last_name: string;
  street_address: string;
  postal_code: string;
  country: string;
  state: string;
  email: string;
  phone: string;
};

type MerchContextProps = {
  products: Item[];
  cart: Cart;
  setCart: (cart: Cart) => void;
  orderAddress: Address;
  setAddress: (address: Address) => void;
  addedModal: boolean;
  setAddedModal: (addedModal: boolean) => void;
  maxModal: boolean;
  setMaxModal: (maxModal: boolean) => void;
};

const MerchContext = createContext<MerchContextProps>({
  products: [] as Item[],
  cart: {} as Cart,
  setCart: () => {},
  orderAddress: {} as Address,
  setAddress: () => {},
  addedModal: false,
  setAddedModal: () => {},
  maxModal: false,
  setMaxModal: () => {},
});

type ProviderProps = {} & PropsWithChildren;
export const MerchContextProvider = ({ children }: ProviderProps) => {
  const [products, setTheProducts] = useState<Item[]>([]);
  const [cart, setTheCart] = useState<Cart>({
    cartUuid: "",
    transactionId: "",
    payToAddress: "",
    cartItems: [],
    subTotalPrice: 0,
    shippingPrice: 0,
    totalPrice: 0,
    estimatedTotal: 0,
    estimatedCurrency: "",
    paymentMethod: "ADA",
  });
  const [orderAddress, setTheAddress] = useState<Address>({
    first_name: "",
    last_name: "",
    street_address: "",
    postal_code: "",
    country: "",
    state: "",
    email: "",
    phone: "",
  });
  const { isConnected } = useWalletContext();

  const setProducts = (products: Item[]) => {
    setTheProducts(products);
  };

  const setCart = (cart: Cart) => {
    setTheCart(cart);
  };

  const setAddress = (address: Address) => {
    setTheAddress(address);
  };

  const [addedModal, setAddedModal] = useState(false);
  const [maxModal, setMaxModal] = useState(false);

  useEffect(() => {
    //get products from backend every 2 minutes
    if (isConnected) {
      fetch("/api/products")
        .then((res) => res.json())
        .then((data) => {
          setProducts(data);
        });
    }
    const interval = setInterval(() => {
      if (isConnected) {
        fetch("/api/products")
          .then((res) => res.json())
          .then((data) => {
            setProducts(data);
          });
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [isConnected]);

  //set subTotal when cartItems changes
  useEffect(() => {
    let subTotal = 0;
    cart.cartItems.forEach((item) => {
      const product = products.find((product) => product.name === item.name);
      if (product) {
        subTotal += product.price * item.quantity;
      }
    });
    setCart({ ...cart, subTotalPrice: subTotal });
  }, [cart.cartItems]);

  return (
    <MerchContext.Provider
      value={{
        products,
        cart,
        setCart,
        orderAddress,
        setAddress,
        addedModal,
        setAddedModal,
        maxModal,
        setMaxModal,
      }}
    >
      {children}
    </MerchContext.Provider>
  );
};

export const useMerchContext = () => useContext(MerchContext);
