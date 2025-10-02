import { ShoppingCart } from "lucide-react";
import { priceFormatter } from "../utils/price-formatter";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useLocation } from "react-router";
import { CartContext } from "../context/CartContext";
import { toast } from "sonner";

type ItemProperties = {
  title: string;
  description: string;
  img: string;
  price: number;
  id: string;
  getMenuItems: () => void;
};

const Item = ({
  title,
  description,
  price,
  img,
  id,
  getMenuItems,
}: ItemProperties) => {
  const { user } = useContext(UserContext);
  const { getCartItems, cartItems } = useContext(CartContext);
  const location = useLocation();

  const handleDeleteProduct = async (productId: string) => {
    const products = await fetch(
      `http://localhost:3000/delete-menu-item/${productId}`,
      {
        credentials: "include",
        method: "DELETE",
      }
    );

    const data = await products.json();

    if (!products.ok) {
      toast.error(data.message || "Erro ao deletar produto");
      return;
    }

    getMenuItems();
  };

  const handleAddToCart = async (productId: string) => {
    if (cartItems.find((item) => item.productId === productId)) {
      toast.info("Item já está no carrinho");
      return;
    }

    const response = await fetch(
      `http://localhost:3000/create-cart/${productId}`,
      {
        credentials: "include",
        method: "POST",
      }
    );

    const data = await response.json();
    console.log(data);

    if (!response.ok) {
      toast.error(data.message || "Erro ao adicionar ao carrinho");
      return;
    }

    getCartItems();
  };

  return (
    <div className="flex">
      <img
        src={img}
        alt=""
        className="w-[100px] h-[83px] md:w-[200px] md:h-[166px]"
      />
      <div className="pl-2 flex flex-col justify-between w-full">
        <div>
          <div className="uppercase text-lg font-bold text-white flex items-center justify-between md:mb-3">
            <p className="text-md md:text-md">{title}</p>
            {user?.admin && location.pathname === "/cardapio" && (
              <span
                className="ml-4 px-2 border-1 rounded-md text-red-500 cursor-pointer text-xs md:text-sm"
                onClick={() => handleDeleteProduct(id)}
              >
                deletar
              </span>
            )}
          </div>
          <p className="text-[#848484] md:text-md">{description}</p>
        </div>
        <div className="flex items-center justify-end gap-4">
          <p className="font-bold text-[#F2DAAC]">{priceFormatter(price)}</p>
          <ShoppingCart
            className="text-white cursor-pointer"
            size={18}
            onClick={() => handleAddToCart(id)}
          />
        </div>
      </div>
    </div>
  );
};

export default Item;
