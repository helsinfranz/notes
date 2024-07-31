import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

interface AddNoteRequestBody {
  title: string;
  status: string;
  priority?: string;
  deadline?: Date;
  description?: string;
  time_ago?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const data: AddNoteRequestBody = req.body;
  const { title, status, priority, deadline, description, time_ago } = data;

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
    email: session.user?.email,
    title,
    status,
    priority,
    deadline,
    description,
    time_ago,
  };

  const client = await connectToDatabase();
  const db = client.db();

  try {
    const addedNotes = await db.collection("notes").insertOne(notesData);
    res
      .status(201)
      .json({ _id: addedNotes.insertedId, message: "Note Uploaded!" });
  } catch (err) {
    res
      .status(422)
      .json({ message: "Error with Database Integration: " + err });
  } finally {
    client.close();
  }
}
