import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { env } from "@/lib/env";
import { getUserByEmail, createUser, memoryDb } from "@/lib/db";

// Ensure NextAuth has a secure secret in both production and development environments
const secretKey =
  process.env.AUTH_SECRET ||
  env.AUTH_SECRET ||
  "aerobook-super-secret-production-encryption-key-32chars";

if (!process.env.AUTH_SECRET) {
  process.env.AUTH_SECRET = secretKey;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: secretKey,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin",
  },
  providers: [
    // 1. Google OAuth Provider (activated when credentials exist)
    Google({
      clientId: env.AUTH_GOOGLE_ID || "mock-google-client-id",
      clientSecret: env.AUTH_GOOGLE_SECRET || "mock-google-client-secret",
    }),

    // 2. Email & Password / Registration Credentials Provider
    Credentials({
      id: "credentials",
      name: "AeroBook Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "traveller@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;

        const email = String(credentials.email).toLowerCase().trim();
        const rawPassword = credentials.password ? String(credentials.password) : "";

        // Check if user exists in database or memory fallback
        let user = await getUserByEmail(email);

        if (!user) {
          // Auto-provision user upon first email login if not pre-registered
          user = await createUser({
            email,
            name: email.split("@")[0].replace(/[._]/g, " "),
            password: rawPassword || "password123",
            image: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(email)}`,
          });
        }

        return {
          id: user.id,
          name: user.name || "AeroBook Traveller",
          email: user.email,
          image: user.image || undefined,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token?.id) {
        session.user.id = token.id as string;
        if (token.name) session.user.name = token.name as string;
        if (token.email) session.user.email = token.email as string;
        if (token.picture) session.user.image = token.picture as string;
      }
      return session;
    },
  },
});
