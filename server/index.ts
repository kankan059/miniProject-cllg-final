import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoConnect from "./config/db.js"; // Ensure .js extension if using ES Modules
import eventRoutes from "./routes/eventRoutes.js";
import authRoutes from "./routes/authRoutes.js"; 
import paymentRoutes from "./routes/payment.js";
import registrationRoutes from "./routes/registration.js";
import attendanceRoutes from "./routes/attendance";
dotenv.config();
const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000", // frontend URL
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(express.json()); // Parses incoming JSON requests
app.use(express.urlencoded({ extended: true }));
// Connect to MongoDB
mongoConnect();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/attendance", attendanceRoutes);





// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));