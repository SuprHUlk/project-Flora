import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY: string = process.env.SECRET_KEY!;

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const cookieHeader = req.headers.cookie;
    let token: string | undefined;

    if (cookieHeader) {
      const match = cookieHeader.match(/token=([^;]+)/);
      token = match ? match[0].split("=")[1] : undefined;
    }
    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    if (!req.body) req.body = {};
    req.body.user = decoded;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "Invalid token" });
    return;
  }
}
