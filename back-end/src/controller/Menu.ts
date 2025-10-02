import type { Request, Response } from "express";
import { prisma } from "../db.js";
import jwt from "jsonwebtoken";
import type { User } from "../generated/prisma/index.js";
import { deleteServerImg } from "../utils/delete-server-img.js";

export const MenuController = {
  async getAllMenuItems(req: Request, res: Response) {
    try {
      const items = await prisma.product.findMany();

      const data = items.map((item) => ({
        ...item,
        price: item.price / 1000,
      }));

      res.status(200).json({ status: true, response: data });
    } catch (error) {
      res
        .status(500)
        .json({ status: false, message: "Erro ao buscar itens do menu." });
      return;
    }
  },
  async deleteMenuItem(req: Request, res: Response) {
    const { productId } = req.params;
    const { user } = req.cookies;

    if (!process.env.JWT_SECRET) {
      res.status(500).json({ status: false, message: "Erro no servidor." });
      return;
    }

    const usuario = jwt.verify(user, process.env.JWT_SECRET) as User;

    if (usuario.admin !== true) {
      res.status(403).json({
        status: false,
        message: "Acesso negado, usuário deve sere aministrador",
      });
      return;
    }

    if (!productId) {
      res
        .status(400)
        .json({ status: false, message: "ID do produto é obrigatório." });
      return;
    }

    try {
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      const img = product?.img.split("3000/")[1];

      if (!img) {
        res
          .status(400)
          .json({ status: false, message: "Imagem não encontrada." });
        return;
      }

      deleteServerImg(`./public/imgs/${img}`);

      await prisma.product.delete({
        where: { id: productId },
      });

      res
        .status(200)
        .json({ status: true, message: "Produto removido com sucesso." });
    } catch (error) {
      res
        .status(500)
        .json({ status: false, message: "Erro ao remover produto do menu." });
    }
  },
};
