import { MongoClient } from "mongodb";

// Ensure the type of process.env.MONGODB_URI is a string
const MONGODB_URI = process.env.MONGODB_URI as string;

export async function connectToDatabase(): Promise<MongoClient> {
  const client = await MongoClient.connect(MONGODB_URI);
  return client;
}
