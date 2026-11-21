import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";

export const loginUser = async (
  email: string,
  password: string
) => {
  // Find employee using email
  const user = await prisma.user.findUnique({
    where: { email }
  });

  // Check whether employee exists
  if (!user) {
    return null;
  }

  // Compare entered password with stored password hash
  const isPasswordCorrect = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordCorrect) {
    return null;
  }

  return user;
};