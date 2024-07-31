import type { NextApiRequest, NextApiResponse } from "next";
import { hashPassword } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";

interface SignupRequestBody {
  name: string;
  email: string;
  password: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const data: SignupRequestBody = req.body;
  const { name, email, password } = data;

  if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    return res.status(422).json({ message: "Invalid Email Address." });
  }
  if (password.length === 0) {
    return res.status(422).json({ message: "Password is required." });
  }
  if (name.length === 0) {
    return res.status(422).json({ message: "Name is required." });
  }

  const client = await connectToDatabase();
  const db = client.db();

  const existingUser = await db.collection("users").findOne({ email });

  if (existingUser) {
    res.status(422).json({ message: "User Already Exists!" });
    client.close();
    return;
  }

  const hashedPassword = await hashPassword(password);

  await db.collection("users").insertOne({
    username: name,
    email,
    password: hashedPassword,
    date_joined: new Date(),
  });

  res.status(201).json({ message: "User Created!" });
  client.close();
}
