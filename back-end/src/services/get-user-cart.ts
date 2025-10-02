import { prisma } from "../db.js";

export const getUserCart = async (userId: string) => {
  const items = await prisma.cartItem.findMany({
    where: { userId, orderId: null },
    include: {
      product: true,
    },
  });

  return items;
};
