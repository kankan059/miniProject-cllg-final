// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import mongoConnect  from "./config/db";
// import eventRoutes from "./routes/eventRoutes";

// dotenv.config();
// const app = express();
// app.use(cors({ origin: "http://localhost:3000", credentials: true }));
// app.use(cors());
// app.use(express.json());

// mongoConnect();

// // routes
// app.use("/api/events", eventRoutes);

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));



import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoConnect from "./config/db.js"; // Ensure .js extension if using ES Modules
import eventRoutes from "./routes/eventRoutes.js";
import authRoutes from "./routes/authRoutes.js"; // Renamed for clarity
import paymentRoutes from "./routes/payment.js";
import registrationRoutes from "./routes/registration.js";
dotenv.config();
const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // frontend URL
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



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));