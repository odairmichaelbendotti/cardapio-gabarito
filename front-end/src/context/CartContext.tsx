import { createContext, useEffect, useState, type ReactNode } from "react";
import type { CartItemType } from "../types/Cart";

type CartContextType = {
  cartItems: CartItemType[] | [];
  setCartItems: React.Dispatch<React.SetStateAction<CartItemType[] | []>>;
  getCartItems: () => void;
};

export const CartContext = createContext<CartContextType>({
  cartItems: [],
  setCartItems: () => {},
  getCartItems: () => {},
});

const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItemType[] | []>([]);

  const getCartItems = async () => {
    try {
      const response = await fetch("http://localhost:3000/get-user-cart", {
        credentials: "include",
      });

      const data = await response.json();

      if (data.response.length > 0) {
        setCartItems(data.response);
      } else {
        setCartItems([]);
      }
    } catch (err) {
      console.log(err);
      return;
    }
  };

  useEffect(() => {
    getCartItems();
  }, []);

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, getCartItems }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
