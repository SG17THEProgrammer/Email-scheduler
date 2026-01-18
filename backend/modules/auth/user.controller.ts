
import { db } from "../../config/db";
import { Request, Response } from "express";

export async function getUser(req:Request, res:Response) {
  const { email } = req.body;

  const [sender] = await db.query(
    "SELECT * FROM users WHERE email=?",
    [email]
  );

  const user = (sender as any[])[0];
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      provider: user.provider
    }
  });
}

export async function getSenderById(req:Request, res:Response) {
  const id = req.body.id;

  const [sender] = await db.query(
    "SELECT * FROM senders WHERE id=?",
    [id]
  );
  res.json(sender);
}
