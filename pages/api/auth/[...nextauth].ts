import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyPassword } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";

// interface User {
//   email: string;
//   password: string;
// }

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials, req) => {
        if (
          !credentials?.email ||
          !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(credentials.email)
        ) {
          return null;
          // throw new Error("Invalid Email Address.");
        }
        if (!credentials?.password || credentials.password.length === 0) {
          return null;
          // throw new Error("Password is required");
        }

        const client = await connectToDatabase();
        const collection = client.db().collection("users");
        const user = await collection.findOne({ email: credentials?.email });
        client.close();

        if (!user) {
          return null;
          // throw new Error("No user found!");
        }

        const isValid = await verifyPassword(
          credentials?.password || "",
          user.password
        );

        if (!isValid) {
          return null;
          // throw new Error("Login Error: Invalid Credentials.");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.username,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
