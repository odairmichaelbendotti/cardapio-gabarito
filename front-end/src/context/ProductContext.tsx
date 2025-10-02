import { createContext, useState, type ReactNode } from "react";
import type { Product } from "../types/Product";

type ProductContextType = {
  menuItems: Product[] | [];
  setMenuItems: React.Dispatch<React.SetStateAction<Product[] | []>>;
  getMenuItems: () => void;
};

export const ProductContext = createContext<ProductContextType>({
  menuItems: [],
  setMenuItems: () => {},
  getMenuItems: () => {},
});

const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [menuItems, setMenuItems] = useState<Product[] | []>([]);

  const getMenuItems = async () => {
    const response = await fetch("http://localhost:3000/get-menu-items");

    const data = await response.json();

    if (!response.ok) {
      console.log("Erro ao buscar itens do cardápio");
      return;
    }

    setMenuItems(data.response);
  };

  return (
    <ProductContext.Provider value={{ menuItems, setMenuItems, getMenuItems }}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;
