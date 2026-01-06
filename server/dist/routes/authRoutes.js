"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = express_1.default.Router();
//test
router.get("/test", (req, res) => {
    res.json({ message: " route working!" });
});
//register
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existance = await User_1.default.findOne({ email });
        if (existance)
            return res.status(400).json({ message: "user is already exit" });
        const hased = await bcryptjs_1.default.hash(password, 10);
        const user = new User_1.default({ name, email, password: hased });
        await user.save();
        res.status(201).json({ message: "user registered successfully!!!!!!" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "server error beta" });
    }
});
//Login 
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email & password required" });
        }
        const user = await User_1.default.findOne({ email });
        if (!user || !user.password) {
            return res.status(400).json({ message: "User invalid" });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "2d" });
        res.json({ token, user });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "server problem" });
    }
});
exports.default = router;
