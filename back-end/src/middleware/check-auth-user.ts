import type { NextFunction, Request, Response } from "express";

export const AuthUser = (req: Request, res: Response, next: NextFunction) => {
  const { user } = req.cookies;

  if (!user) {
    res.status(401).json({ status: false, message: "Usuário não autenticado" });
    return;
  }

  res.locals.user = user;
  next();
};
