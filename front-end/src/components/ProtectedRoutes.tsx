import { useEffect, type ReactNode } from "react";
import { useNavigate, useLocation } from "react-router";
import { toast } from "sonner";

const ProtectedRoutes = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const checkUserAdmin = async () => {
    const response = await fetch("http://localhost:3000/protected-admin", {
      credentials: "include",
    });

    const data = await response.json();
    console.log(data);

    // Caso 1: Usuário tentando acessar signin/signup já logado (direcionado para home)
    if (
      (location.pathname === "/signin" || location.pathname === "/signup") &&
      data.authUser
    ) {
      navigate("/");
      toast.info("Usuário já está logado.");
      return;
    }

    // Caso 2: Usuário não admin tentando acessar rotas admin (direeciona para home)
    if (
      (location.pathname === "/cardapio" || location.pathname === "/pedidos") &&
      data.isAdmin === false
    ) {
      navigate("/");
      toast.error("Usuário não é administrador");
      return;
    }
  };

  useEffect(() => {
    checkUserAdmin();
  }, []);

  return <div>{children}</div>;
};

export default ProtectedRoutes;
