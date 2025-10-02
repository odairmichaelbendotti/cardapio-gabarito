import type { Request, Response } from "express";
import { prisma } from "../db.js";

export const ProductController = {
  async createProduct(req: Request, res: Response) {
    const { file } = req;
    const { name, description, category, price } = req.body;

    if (!file) {
      return res.status(400).json({ message: "Image file is required." });
    }

    if (!name || !description || !category || !price) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const productData = await prisma.product.create({
      data: {
        name,
        description,
        category,
        price: parseFloat(price) * 1000,
        img: `http://localhost:3000/${file.filename}`,
      },
    });

    res.json(productData);
  },
};
