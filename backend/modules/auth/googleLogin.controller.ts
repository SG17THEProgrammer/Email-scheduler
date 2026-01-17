import axios from "axios";
import jwt from "jsonwebtoken";
import { db } from "../../config/db";
import { Request, Response } from "express";

export async function googleLogin(req:Request,res:Response) {
  const { token } = req.body;
  console.log("Token" , token);

  const response = await axios.get(
  `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`
);


  const { email, name, picture } = response.data;

  const [rows] = await db.query(
    "SELECT * FROM users WHERE email=?",
    [email]
  );

  let user = (rows as any[])[0];

  if (!user) {
    const [result] = await db.query(
      `INSERT INTO users (email, name, avatar, provider)
       VALUES (?, ?, ?, 'google')`,
      [email, name, picture]
    );
    user = {
      id: (result as any).insertId,
      email,
      name,
      avatar: picture,
      provider: "google"
    };
  }

  const verifiedToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);

  res.json({ verifiedToken, user });
}
