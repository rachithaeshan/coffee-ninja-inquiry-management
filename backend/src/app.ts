import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./config/prisma.js";
import inquiryRoutes from "./routes/inquiry.routes.js";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/inquiries", inquiryRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Coffee Ninja API is running!"
  });
});

app.get("/api/db-health", async (req, res) => {
  try {
    await prisma.$connect();

    res.status(200).json({
      success: true,
      message: "PostgreSQL connected successfully!"
    });
  } catch (error) {
    console.error("Database connection error:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed."
    });
  }
});

export default app;
