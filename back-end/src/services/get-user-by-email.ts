import { prisma } from "../db.js";

export const getUserByEmail = async (email: string) => {
  const user = await prisma.user.findFirst({
    where: { email },
  });

  return user;
};
3;
