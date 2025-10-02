import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import MainLayout from "./Layouts/MainLayout.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Registrar.tsx";
import { AuthProvider } from "./context/UserContext.tsx";
import Cardapio from "./pages/Cardapio.tsx";
import Pedidos from "./pages/Pedidos.tsx";
import ProtectedRoutes from "./components/ProtectedRoutes.tsx";
import { Toaster } from "sonner";
import CartProvider from "./context/CartContext.tsx";
import OrderProvider from "./context/OrderContext.tsx";
import ProductProvider from "./context/ProductContext.tsx";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Cardapio />,
      },
      {
        path: "/cardapio",
        element: (
          <ProtectedRoutes>
            <Cardapio />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/pedidos",
        element: (
          <ProtectedRoutes>
            <Pedidos />
          </ProtectedRoutes>
        ),
      },
    ],
  },
  {
    path: "/signin",
    element: (
      <ProtectedRoutes>
        <Login />
      </ProtectedRoutes>
    ),
  },
  {
    path: "/signup",
    element: (
      <ProtectedRoutes>
        <Register />
      </ProtectedRoutes>
    ),
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <OrderProvider>
            <RouterProvider router={router} />
            <Toaster position="top-right" richColors />
          </OrderProvider>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  </StrictMode>
);
