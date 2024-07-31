import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { ObjectId } from "mongodb";

interface EditNoteRequest {
  _id: string;
  title: string;
  status: string;
  priority?: string;
  deadline?: string;
  description?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(401).end();
  }

  const data: EditNoteRequest = req.body;
  const { _id, title, status, priority, deadline, description } = data;

  if (!title) {
    return res.status(422).json({ message: "Title cannot be empty." });
  }
  if (!status) {
    return res.status(422).json({ message: "Status cannot be empty" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Not authenticated!" });
  }

  const notesData = {
    title,
    status,
    priority,
    deadline,
    description,
  };

  const client = await connectToDatabase();
  const db = client.db();

  try {
    await db
      .collection("notes")
      .updateOne(
        { _id: new ObjectId(_id), email: session.user?.email },
        { $set: notesData },
        { upsert: true }
      );
    return res.status(200).json({ message: "Note Edited!" });
  } catch (err) {
    return res
      .status(422)
      .json({ message: "Error with Database Integration: " });
  } finally {
    client.close();
  }
}
