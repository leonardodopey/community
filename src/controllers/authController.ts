import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma";

export const signup = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role === "ORGANIZER" ? "ORGANIZER" : "VOLUNTEER",
      },
    });
    res.status(201).json({
      message: "User created",
      // user: { id: user.id, email: user.email },
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "User already exists or invalid data" });
  }
};

export const signin = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );
    return res.json({ token,role:user.role });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};
