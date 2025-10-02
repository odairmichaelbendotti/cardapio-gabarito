import { ChevronLeft, ChevronRight, Trash, X } from "lucide-react";
import Button from "./Button";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { priceFormatter } from "../utils/price-formatter";
import { toast } from "sonner";

type ShowCartType = {
  showCart: boolean;
  setShowCart: React.Dispatch<React.SetStateAction<boolean>>;
};

const Cart = ({ showCart, setShowCart }: ShowCartType) => {
  const { cartItems, getCartItems, setCartItems } = useContext(CartContext);

  const deleteCartItem = async (productId: string) => {
    try {
      await fetch(`http://localhost:3000/delete-cart-product/${productId}`, {
        method: "DELETE",
        credentials: "include",
      });

      getCartItems();
    } catch (err) {
      console.log(err);
      return;
    }
  };

  const handleAddItemCart = async (cartId: string) => {
    const response = await fetch(
      `http://localhost:3000/add-cart-item/${cartId}`,
      {
        method: "PUT",
      }
    );
    const data = await response.json();
    console.log(data);

    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === data.id) {
          return {
            ...item,
            quantity: data.quantity,
            totalPrice: data.totalPrice,
          };
        }
        return item;
      })
    );
  };

  const handleDecreaseItemCart = async (cartId: string) => {
    const response = await fetch(
      `http://localhost:3000/decrease-cart-item/${cartId}`,
      {
        method: "PUT",
      }
    );
    const data = await response.json();

    if (data.quantity === 0) {
      deleteCartItem(cartId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === data.id) {
          return { ...item, quantity: data.quantity };
        }
        return item;
      })
    );
  };

  const handleCreateOrder = async () => {
    try {
      const response = await fetch("http://localhost:3000/create-order", {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      console.log(data);

      if (data.status === false) {
        toast.error("Erro ao criar pedido");
        return;
      } else {
        toast.success("Pedido realizado com sucesso");
        getCartItems();
      }
    } catch (err) {
      console.log(err);
      return;
    }
  };

  return (
    <div className="absolute top-0 right-0 h-screen bg-[#F2DAAC] w-[375px] z-1 p-5 text-[#161410] font-bold flex flex-col">
      <div className="flex justify-between items-center">
        <X className="cursor-pointer" onClick={() => setShowCart(!showCart)} />
        <p>Meu carrinho</p>
      </div>

      <div className="mt-8 flex flex-col gap-2 flex-1">
        {cartItems.map((item) => (
          <div className="flex gap-2" key={item.id}>
            <img
              src={item.product.img}
              className="w-[100px] h-[83px] rounded-md"
            />
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col">
                <p className="uppercase text-sm">{item.product.name}</p>
                <p className="text-white">
                  {priceFormatter(item.product.price * item.quantity)}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <ChevronLeft
                    className="p-[2px] rounded-lg bg-[#C92A0E] cursor-pointer text-white"
                    onClick={() => handleDecreaseItemCart(item.id)}
                  />
                  <div className="text-sm">{item.quantity}</div>
                  <ChevronRight
                    className="p-[2px] rounded-lg bg-[#C92A0E] cursor-pointer text-white"
                    onClick={() => handleAddItemCart(item.id)}
                  />
                </div>
              </div>
              <Trash
                size={18}
                className="cursor-pointer"
                onClick={() => deleteCartItem(item.id)}
              />
            </div>
          </div>
        ))}
      </div>

      <Button text="Finalizar pedido" onClick={handleCreateOrder} />
    </div>
  );
};

export default Cart;
