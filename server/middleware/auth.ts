import { Request, Response, NextFunction } from "express";
import User from "../models/User";

export async function auth(req: any, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token" });
    }

    const email = authHeader.split(" ")[1];

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (err) {
    res.status(401).json({ message: "Auth failed" });
  }
}