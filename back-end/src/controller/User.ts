import type { Request, Response } from "express";
import { getUserByEmail } from "../services/get-user-by-email.js";
import { generatePasswordHash } from "../utils/hash-password.js";
import { compareHashedPassword } from "../utils/compare-password.js";
import { createNewUser } from "../services/create-new-user.js";
import jwt from "jsonwebtoken";
import type { User } from "../generated/prisma/index.js";

export const UserController = {
  //CRIAR NOVO USUÁRIO
  async register(req: Request, res: Response) {
    const { name, email, password, cep } = req.body;

    if (!name || !email || !password || !cep) {
      res.status(500).json({
        status: false,
        message: "Todas as informações são obrigatórias.",
      });
      return;
    }

    const user = await getUserByEmail(email);

    if (user) {
      res.status(200).json({ status: false, message: "E-mail já cadastrado." });
      return;
    }

    const hashedPassword = await generatePasswordHash(password);

    if (!hashedPassword) {
      res.status(300).json({
        status: false,
        message: "Erro ao realizar hashing da sua senha",
      });
      return;
    }

    const newUser = await createNewUser({ name, email, hashedPassword, cep });

    if (!process.env.JWT_SECRET) return;

    const token = jwt.sign(newUser, process.env.JWT_SECRET);
    res.cookie("user", token);

    res.status(200).json({ status: true, user: newUser });
  },

  // FAZER LOGIN
  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      res
        .status(500)
        .json({ status: false, message: "E-mail ou senha não informados" });
      return;
    }

    const user = await getUserByEmail(email);

    if (!user) {
      return;
    }

    const isPasswordValid = await compareHashedPassword(
      password,
      user?.password
    );

    if (!isPasswordValid) {
      res.status(300).json({ status: false, message: "Erro de autenticação" });
      return;
    }

    if (!process.env.JWT_SECRET) return;

    const token = jwt.sign(user, process.env.JWT_SECRET);

    res.cookie("user", token);
    res.status(200).json({ status: true, user });
  },

  // VERIFICAR SE USUÁRIO ESTÁ AUTENTICADO
  async isAuthUser(req: Request, res: Response) {
    const { user } = res.locals;

    try {
      if (!process.env.JWT_SECRET) return;
      const decoded = jwt.verify(user, process.env.JWT_SECRET);

      res.status(200).json({ status: true, user: decoded });
    } catch (err) {
      console.log(err);
      return;
    }
  },

  //DESLOGAR USUÁRIO
  async logout(req: Request, res: Response) {
    try {
      res.clearCookie("user");

      res
        .status(200)
        .json({ status: true, message: "Usuário deslogado com sucesso" });
    } catch (err) {
      console.log(err);
      return;
    }
  },

  async protectedAdmin(req: Request, res: Response) {
    const { user } = res.locals;
    if (!process.env.JWT_SECRET) return;

    try {
      const response = jwt.verify(user, process.env.JWT_SECRET) as User;

      if (!response.admin) {
        res.status(401).json({ isAdmin: false, authUser: true });
        return;
      }

      res.status(200).json({ isAdmin: true, authUser: true });
    } catch (err) {
      console.log(err);
      return;
    }
  },
};
