import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { createUser } from "../services/user.service.js";

export const createUserController = async (
  req: Request,
  res: Response
) => {
  try {
    const body = req.body;

    // Check whether all fields contain valid text
    if (
      !body ||
      typeof body.name !== "string" ||
      typeof body.email !== "string" ||
      typeof body.password !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required."
      });
    }

    const name = body.name.trim();
    const email = body.email.trim().toLowerCase();
    const password = body.password;

    if (!name || !email || !password.trim()) {
      return res.status(400).json({
        success: false,
        message: "All fields are required."
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address."
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 8 characters."
      });
    }

    const user = await createUser({
      name,
      email,
      password
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully.",
      data: user
    });

  } catch (error) {
    // Handle duplicate email addresses
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists."
      });
    }

    console.error("Create user error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create user."
    });
  }
};