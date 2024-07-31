import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(401).end();
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Not authenticated!" });
  }

  const client = await connectToDatabase();
  const db = client.db();

  try {
    const notes = await db
      .collection("notes")
      .find({ email: session.user?.email })
      .sort({ _id: -1 })
      .toArray();
    return res.status(200).json(notes);
  } catch (err) {
    return res
      .status(422)
      .json({ message: "Error with Database Integration: " });
  } finally {
    client.close();
  }
}
