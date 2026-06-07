import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/AppError";
import { hashPassword, comparePassword } from "../utils/hash";
import { signToken } from "../utils/jwt";

const prisma = new PrismaClient();

export interface AuthResult {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export const register = async (
  name: string,
  email: string,
  password: string,
): Promise<AuthResult> => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new AppError("Email is already in use", 400);
  }

  const hashed = await hashPassword(password);

  const user = await prisma.user.create({
    data: { name, email, password: hashed },
  });

  const token = signToken(user.id);

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email },
  };
};

export const login = async (
  email: string,
  password: string,
): Promise<AuthResult> => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = signToken(user.id);

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email },
  };
};
