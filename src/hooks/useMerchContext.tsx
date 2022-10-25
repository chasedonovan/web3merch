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

type Cart = {
  cartUuid: string;
  cartItems: CartItem[];
  subTotal: number;
}

type MerchContextProps = {
  products: Item[];
  cart: Cart;
  setCart: (cart: Cart) => void;
}

const MerchContext = createContext<MerchContextProps>({
  products: [] as Item[],
  cart: {} as Cart,
  setCart: () => {},
});

type ProviderProps = {} & PropsWithChildren;
export const MerchContextProvider = ({ children }: ProviderProps) => {
  const [products, setTheProducts] = useState<Item[]>([]);
  const [cart, setTheCart] = useState<Cart>({ cartUuid: "", cartItems: [], subTotal: 0 });
  const { isConnected } = useWalletContext();

  const setProducts = (products: Item[]) => {
    setTheProducts(products);
  };

  const setCart = (cart: Cart) => {
    setTheCart(cart);
  };


    useEffect(() => {
      if (isConnected) {
      fetch("/api/products")
        .then((res) => res.json())
        .then((data) => {
          setProducts(data);
        });
      }
    }, [isConnected]);

  return (
    <MerchContext.Provider
      value={{products, cart, setCart}}
    >
      {children}
    </MerchContext.Provider>
  );
};


export const useMerchContext = () => useContext(MerchContext);
