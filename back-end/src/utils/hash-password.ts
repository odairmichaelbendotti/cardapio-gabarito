import bcrypt from "bcrypt";

export const generatePasswordHash = async (password: string) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (err) {
    console.log("Erro ao hasear sua senha");
    return;
  }
};
