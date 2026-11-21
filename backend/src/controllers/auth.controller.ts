import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { loginUser } from "../services/auth.service.js";

export const loginController = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required."
      });
    }

    const user = await loginUser(
      email.trim().toLowerCase(),
      password
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is not configured.");
    }

    // Generate employee access token
    const token = jwt.sign(
      { userId: user.id },
      secret,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      data: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to login."
    });
  }
};