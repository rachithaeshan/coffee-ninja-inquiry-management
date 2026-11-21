import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    // Check whether token was provided
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required."
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token."
      });
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is not configured.");
    }

    // Verify the token
    const decoded = jwt.verify(token, secret);

    if (
      typeof decoded === "string" ||
      typeof decoded.userId !== "string"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token."
      });
    }

    // Store employee ID for later use
    req.userId = decoded.userId;

    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token."
    });
  }
};

export default requireAuth;