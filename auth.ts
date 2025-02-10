import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required.");
        }

        const user = await prisma?.user?.findUnique({
          where: { email: credentials.email as string },
        });

        

        if (!user) {
          throw new Error("Invalid credentials.");
        }
        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user?.id;
        token.email = user?.email;
        token.name = user?.name;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      return url === "/signin" ? baseUrl : url;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "auth/login",
  },
  session: {
    strategy: "jwt",
  },
});