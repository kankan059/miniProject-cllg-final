"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = auth;
const User_1 = __importDefault(require("../models/User"));
async function auth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "No token" });
        }
        const email = authHeader.split(" ")[1];
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        req.user = {
            id: user._id,
            email: user.email,
            role: user.role,
        };
        next();
    }
    catch (err) {
        res.status(401).json({ message: "Auth failed" });
    }
}
