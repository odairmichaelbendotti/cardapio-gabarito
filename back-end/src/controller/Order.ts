import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { User } from "../generated/prisma/index.js";
import { prisma } from "../db.js";

export const OrderController = {
  async createOrder(req: Request, res: Response) {
    const { user } = res.locals;

    if (!process.env.JWT_SECRET) {
      res.status(500).json({ status: false, message: "Erro no servidor" });
      return;
    }

    const usuario = jwt.verify(user, process.env.JWT_SECRET) as User;

    const cartItemsFromUser = await prisma.cartItem.findMany({
      where: { userId: usuario.id, orderId: null },
      include: { product: true },
    });

    console.log(cartItemsFromUser);

    if (cartItemsFromUser.length === 0) {
      res.status(400).json({ status: false, message: "Carrinho vazio" });
      return;
    }

    if (!cartItemsFromUser) return;

    let total = 0;

    for (let i = 0; i < cartItemsFromUser.length; i++) {
      const item = cartItemsFromUser[i];

      // Continue pulará para o próximo item se o produto for nulo ou indefinido
      if (!item?.product) continue;

      total += item.quantity * item.product.price;
    }

    const order = await prisma.order.create({
      data: {
        total: total,
        createdAt: new Date(),
      },
      include: { cartItem: true },
    });

    await prisma.cartItem.updateMany({
      where: { userId: usuario.id },
      data: { orderId: order.id },
    });

    res.json(order);
  },
  async getOrders(req: Request, res: Response) {
    const { user } = res.locals;

    if (!process.env.JWT_SECRET) {
      res.status(500).json({ status: false, message: "Erro no servidor" });
      return;
    }

    const usuario = jwt.verify(user, process.env.JWT_SECRET) as User;

    if (!usuario.admin) {
      res.status(403).json({ status: false, message: "Acesso negado" });
      return;
    }

    const orders = await prisma.order.findMany({
      include: {
        cartItem: {
          include: { product: true, user: true },
        },
      },
    });

    const info = [];

    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];

      if (!order) continue;

      const orderItems = {
        id: order?.id,
        qtd: order?.cartItem.length,
        total: order?.total / 1000 ? order?.total / 1000 : 0,
        createdAt: order?.createdAt,
        entrega: order?.entrega ? order?.entrega : null,
        status: order?.status,
        username: order?.cartItem[0]?.user?.name,
      };

      info.push(orderItems);
    }

    res.status(200).json(info);
  },
  async changeOrderStatus(req: Request, res: Response) {
    const { user } = res.locals;
    const { orderId } = req.params;
    const { status } = req.body;

    if (!process.env.JWT_SECRET) {
      res.status(500).json({ status: false, message: "Erro no servidor" });
      return;
    }
    const usuario = jwt.verify(user, process.env.JWT_SECRET) as User;

    if (!usuario.admin) {
      res.status(403).json({ status: false, message: "Acesso negado" });
      return;
    }

    switch (status) {
      case "Retirado":
        try {
          const order = await prisma.order.update({
            where: { id: Number(orderId) },
            data: {
              entrega: new Date(),
              status: "Retirado",
            },
          });
          res
            .status(200)
            .json({ status: order.status, entrega: order.entrega });
          console.log(order);
        } catch (error) {
          res
            .status(400)
            .json({ status: false, message: "Erro ao atualizar pedido" });
          return;
        }
        break;
      case "Cancelado":
        try {
          const order = await prisma.order.update({
            where: { id: Number(orderId) },
            data: { status: "Cancelado", entrega: null },
          });
          res
            .status(200)
            .json({ status: order.status, entrega: order.entrega });
          console.log(order);
        } catch (err) {
          res
            .status(400)
            .json({ status: false, message: "Erro ao atualizar pedido" });
          return;
        }
    }
  },
};
