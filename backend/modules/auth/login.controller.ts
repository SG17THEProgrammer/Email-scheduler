import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../../config/db";
import { Request, Response } from "express";
export async function login(req:Request, res:Response) {
  const { email, password } = req.body;

  const [rows] = await db.query(
    "SELECT * FROM users WHERE email=? AND provider='local'",
    [email]
  );

  const user = (rows as any[])[0];
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      provider: "local"
    }
  });
}
