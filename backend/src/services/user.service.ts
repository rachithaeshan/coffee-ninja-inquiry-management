import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";

export const createUser = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  // Convert the password into a secure hash
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // Save the user in PostgreSQL
  return await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword
    },
    // Return only safe user information
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true
    }
  });
};