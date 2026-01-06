"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const adminAuth = (req, res, next) => {
    const token = req.cookies?.["next-auth.session-token"] ||
        req.cookies?.["__Secure-next-auth.session-token"];
    if (!token) {
        return res.status(401).json({ message: "Not authenticated" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.NEXTAUTH_SECRET);
        if (decoded.role !== "admin") {
            return res.status(403).json({ message: "Admin only" });
        }
        next();
    }
    catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};
exports.adminAuth = adminAuth;
