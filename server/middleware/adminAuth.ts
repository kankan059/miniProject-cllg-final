import jwt from "jsonwebtoken";

import { Request, Response, NextFunction } from "express";

export const adminAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token =
    req.cookies?.["next-auth.session-token"] ||
    req.cookies?.["__Secure-next-auth.session-token"];

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.NEXTAUTH_SECRET!);

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
