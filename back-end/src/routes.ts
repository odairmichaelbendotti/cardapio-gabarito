import { Router, type Request, type Response } from "express";
import { UserController } from "./controller/User.js";
import { AuthUser } from "./middleware/check-auth-user.js";
import { CartController } from "./controller/Cart.js";
import { MenuController } from "./controller/Menu.js";
import { OrderController } from "./controller/Order.js";
import { ProductController } from "./controller/Product.js";
import { upload } from "./utils/multer.js";

export const routes = Router();

// USER
routes.post("/signup", UserController.register);
routes.post("/signin", UserController.login);
routes.get("/auth", AuthUser, UserController.isAuthUser);
routes.get("/logout", UserController.logout);
routes.get("/protected-admin", AuthUser, UserController.protectedAdmin);

// CART
routes.post("/create-cart/:productId", AuthUser, CartController.createCart);
routes.get("/get-user-cart", CartController.getCartItems);
routes.delete("/delete-cart-product/:cartId", CartController.deleteCartItem);
routes.put("/add-cart-item/:cartId", CartController.addProductToCartItem);
routes.put(
  "/decrease-cart-item/:cartId",
  CartController.decreaseProductToCartItem
);

// MENU
routes.get("/get-menu-items", MenuController.getAllMenuItems);
routes.delete("/delete-menu-item/:productId", MenuController.deleteMenuItem);

// ORDER
routes.post("/create-order", AuthUser, OrderController.createOrder);
routes.get("/get-orders", AuthUser, OrderController.getOrders);
routes.put(
  "/order-status/:orderId",
  AuthUser,
  OrderController.changeOrderStatus
);

// CREATE PRODUCT
routes.post(
  "/novo-produto",
  AuthUser,
  upload.single("image"),
  ProductController.createProduct
);
