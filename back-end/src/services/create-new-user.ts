import { prisma } from "../db.js";

interface User {
  name: string;
  email: string;
  hashedPassword: string;
  cep: string;
}

export async function createNewUser({ name, email, hashedPassword, cep }: User) {
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword, cep },
  });
  return user;
}
