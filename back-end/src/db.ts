import { PrismaClient } from "./generated/prisma/index.js";

export const prisma = new PrismaClient();

export async function connect() {
  try {
    await prisma.$connect();
    console.log("Conectado ao banco de dados");
  } catch (error) {
    console.log("Erro ao conectar-se ao banco de dados");
    return;
  }
}
