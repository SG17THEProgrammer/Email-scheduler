import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../../config/db";
import { Request, Response } from "express";

export async function register(req:Request,res:Response) {
  const { email, password, name } = req.body;

  const [existing] = await db.query(
    "SELECT id FROM users WHERE email=?",
    [email]
  );
  if ((existing as any[]).length) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hash = await bcrypt.hash(password, 10);

  const [result] = await db.query(
    `INSERT INTO users (email, password_hash, name, provider)
     VALUES (?, ?, ?, 'local')`,
    [email, hash, name]
  );

  const userId = (result as any).insertId;
  const token = jwt.sign({ userId }, process.env.JWT_SECRET!);

  res.json({
    token,
    user: { id: userId, email, name, provider: "local" }
  });
}
