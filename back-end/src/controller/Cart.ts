import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { User } from "../generated/prisma/index.js";
import { getUserCart } from "../services/get-user-cart.js";
import { deleteCartItemByCartItemId } from "../services/delete-cart-item.js";
import { prisma } from "../db.js";

export const CartController = {
  async getCartItems(req: Request, res: Response) {
    const { user } = req.cookies;

    if (!user) {
      res
        .status(401)
        .json({ status: false, message: "Usuário não autenticado." });
      return;
    }

    if (!process.env.JWT_SECRET) return;

    const data = jwt.verify(user, process.env.JWT_SECRET) as User;

    if (!data) {
      res
        .status(500)
        .json({ status: false, message: "Usuário não encontrado" });
      return;
    }

    const items = await getUserCart(data.id);

    if (items.length === 0) {
      res.status(200).json({ status: true, response: [] });
      return;
    }

    const formattedItems = items.map((item) => {
      return {
        ...item,
        product: { ...item.product, price: item.product.price / 1000 },
      };
    });

    res.status(200).json({ status: true, response: formattedItems });
  },
  async deleteCartItem(req: Request, res: Response) {
    const { cartId } = req.params;

    if (!cartId) {
      res
        .status(401)
        .json({ status: false, response: "ID do CartImte não enviado" });
      return;
    }

    await deleteCartItemByCartItemId(cartId);
    res
      .status(200)
      .json({ status: true, response: "CartItem deletado com sucesso" });
  },
  async addProductToCartItem(req: Request, res: Response) {
    const { cartId } = req.params;

    if (!cartId) {
      res.status(400).json({ status: false, message: "Cart ID is required" });
      return;
    }

    const cart = await prisma.cartItem.update({
      where: {
        id: cartId,
      },
      data: {
        quantity: {
          increment: +1,
        },
      },
      include: {
        product: true,
      },
    });

    res.json(cart);
  },
  async decreaseProductToCartItem(req: Request, res: Response) {
    const { cartId } = req.params;

    if (!cartId) {
      res.status(400).json({ status: false, message: "Cart ID is required" });
      return;
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartId },
    });

    if (cartItem?.quantity === 0) {
      res.status(200).json(cartItem);
      return;
    }

    const cart = await prisma.cartItem.update({
      where: {
        id: cartId,
      },
      data: {
        quantity: {
          increment: -1,
        },
      },
      include: {
        product: true,
      },
    });

    res.json(cart);
  },
  async createCart(req: Request, res: Response) {
    const { user } = req.cookies;
    const { productId } = req.params;

    if (!user) {
      res
        .status(401)
        .json({ status: false, message: "Usuário não autenticado." });
      return;
    }

    if (!process.env.JWT_SECRET) return;

    const data = jwt.verify(user, process.env.JWT_SECRET) as User;

    if (!data) {
      res
        .status(500)
        .json({ status: false, message: "Usuário não encontrado" });
      return;
    }

    console.log(data);

    if (!productId) {
      res
        .status(400)
        .json({ status: false, message: "ID do produto não enviado" });
      return;
    }

    await prisma.cartItem.create({
      data: {
        quantity: 1,
        user: { connect: { id: data.id } },
        product: { connect: { id: productId } },
      },
    });

    res
      .status(201)
      .json({ status: true, message: "Item adicionado ao carrinho" });
  },
};
