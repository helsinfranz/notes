import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { ObjectId } from "mongodb";

interface DeleteNoteRequest {
  _id: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(401).end();
  }

  const data: DeleteNoteRequest = req.body;
  const { _id } = data;

  if (!_id) {
    return res.status(422).json({ message: "ID cannot be empty." });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Not authenticated!" });
  }

  const client = await connectToDatabase();
  const db = client.db();

  try {
    const result = await db.collection("notes").deleteOne({
      _id: new ObjectId(_id),
      email: session.user?.email,
    });
    if (result.deletedCount === 0) {
      return res
        .status(422)
        .json({ message: "Note not found or not authorized to delete." });
    }
    return res.status(201).json({ message: "Note Deleted!" });
  } catch (err) {
    return res
      .status(422)
      .json({ message: "Error with Database Integration: " });
  } finally {
    client.close();
  }
}
