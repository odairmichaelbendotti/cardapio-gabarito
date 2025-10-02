import { prisma } from "../db.js";

export const deleteCartItemByCartItemId = async (cartId: string) => {
  if (!cartId) return;

  await prisma.cartItem.delete({
    where: {
      id: cartId,
    },
  });
};
