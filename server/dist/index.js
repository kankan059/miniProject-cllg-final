"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_js_1 = __importDefault(require("./config/db.js")); // Ensure .js extension if using ES Modules
const eventRoutes_js_1 = __importDefault(require("./routes/eventRoutes.js"));
const authRoutes_js_1 = __importDefault(require("./routes/authRoutes.js"));
const payment_js_1 = __importDefault(require("./routes/payment.js"));
const registration_js_1 = __importDefault(require("./routes/registration.js"));
const attendance_1 = __importDefault(require("./routes/attendance"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: "http://localhost:3000", // frontend URL
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
}));
app.use(express_1.default.json()); // Parses incoming JSON requests
app.use(express_1.default.urlencoded({ extended: true }));
// Connect to MongoDB
(0, db_js_1.default)();
// Routes
app.use("/api/auth", authRoutes_js_1.default);
app.use("/api/events", eventRoutes_js_1.default);
app.use("/api/payment", payment_js_1.default);
app.use("/api/registrations", registration_js_1.default);
app.use("/api/attendance", attendance_1.default);
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
