import { Link } from "react-router";
import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { ShoppingCart, Box, LayoutDashboard, Plus } from "lucide-react";
import Cart from "./Cart";
import { CartContext } from "../context/CartContext";
import AddProduct from "./AddProduct";

const Header = () => {
  const { user, setUser } = useContext(UserContext);
  const { cartItems } = useContext(CartContext);
  const [showCart, setShowCart] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const UserLogout = async () => {
    try {
      await fetch("http://localhost:3000/logout", { credentials: "include" });
      setUser(null);
      navigate("/");
    } catch (err) {
      console.log(err);
      return;
    }
  };

  const getClassName = (route: string) => {
    let base =
      "w-9 h-9 flex items-center justify-center border-2 border-[#F2DAAC] p-1 rounded-md cursor-pointer hover:opacity-90";

    if (location.pathname === route) {
      return (base += " bg-[#F2DAAC] text-[#161410]");
    } else {
      return (base += " text-[#F2DAAC]");
    }
  };

  return (
    <div className="w-full">
      {showCart && <Cart showCart={showCart} setShowCart={setShowCart} />}
      {showAddProduct && (
        <AddProduct
          showAddProduct={showAddProduct}
          setShowAddProduct={setShowAddProduct}
        />
      )}
      <div className="p-4 md:px-0 md:py-2 max-w-[834px] mx-auto flex justify-between items-center">
        <Link to="/">
          <img src="./logo.png" alt="" />
        </Link>

        {user ? (
          <div className="flex items-center gap-8">
            {/* SOMENTE MOSTRAR PARA USUÁRIOS ADMIN */}
            {user.admin && (
              <>
                <div className="pr-4 hidden md:flex items-center gap-2">
                  <div
                    className={getClassName("/cardapio")}
                    onClick={() => navigate("/cardapio")}
                  >
                    <Box size={20} />
                  </div>
                  <div
                    className={getClassName("/pedidos")}
                    onClick={() => navigate("/pedidos")}
                  >
                    <LayoutDashboard size={20} />
                  </div>
                  <div
                    className="w-9 h-9 flex items-center justify-center text-[#F2DAAC] border-2 p-1 rounded-md cursor-pointer hover:opacity-90"
                    onClick={() => setShowAddProduct(true)}
                  >
                    <Plus size={20} />
                  </div>
                </div>
              </>
            )}
            <div
              className="relative cursor-pointer"
              onClick={() => setShowCart(!showCart)}
            >
              <ShoppingCart size={18} className="text-white" />
              {cartItems.length > 0 && (
                <div className="absolute w-5 h-5 flex items-center justify-center rounded-full -top-3 left-3 bg-[#f2daac] p-1">
                  {cartItems.length}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <p className="text-white">{user.name.split(" ")[0]}</p>
              <LogOut
                className="text-white cursor-pointer"
                size={18}
                onClick={UserLogout}
              />
            </div>
          </div>
        ) : (
          <Link to="/signin">
            <button className="w-[130px] bg-[#F2DAAC] py-1 rounded-md font-bold cursor-pointer hover:opacity-90">
              Entrar
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
