import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { env } from "@/lib/env";
import { getUserByEmail, memoryDb } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: env.AUTH_SECRET || "aerobook-super-secret-development-key-32chars",
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

    // 2. Email & Password / Demo Instant Credentials Provider
    Credentials({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "traveller@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;

        const email = String(credentials.email).toLowerCase().trim();

        // Check if user exists in database or memory fallback
        let user = await getUserByEmail(email);

        if (!user) {
          // Auto-provision user upon first email login
          user = memoryDb.createUser({
            email,
            name: email.split("@")[0].replace(/[._]/g, " "),
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
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token?.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
