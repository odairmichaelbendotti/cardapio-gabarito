import bcrypt from "bcrypt";

export const compareHashedPassword = async (password: string, hashedPassword: string) => {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (err) {
    console.log(err);
    return;
  }
};
