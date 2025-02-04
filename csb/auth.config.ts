// auth.config.ts
import type { Account, NextAuthConfig } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email", label: "Email" },
        password: { type: "password", label: "Password" },
      },
      async authorize(credentials: any) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            return null;
          }

          const data = await response.json();

          // Store token (in production, consider using cookies instead)
          if (typeof window !== "undefined") {
            localStorage.setItem("token", data.access_token);
          }

          // Get user profile using the token
          const profileResponse = await fetch(`${API_URL}/auth/profile`, {
            headers: {
              Authorization: `Bearer ${data.access_token}`,
            },
          });

          if (!profileResponse.ok) {
            return null;
          }

          const userProfile = await profileResponse.json();

          return {
            id: userProfile.userId,
            email: credentials.email,
            name: userProfile.userName || credentials.email,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ account }: { account: Account | null }) {
      if (!account || !account.id_token) return false;
      try {
        const response = await fetch(`${API_URL}/auth/google/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idToken: account.id_token,
          }),
        });
        if (!response.ok) return false;

        const responseData = await response.json();
        console.log(responseData);

        // Return true instead of the modified account
        // Store the data in the JWT callback instead
        return true;
      } catch (error) {
        console.error("Error during sign-in:", error);
        return false;
      }
    },

    async jwt({ token, account }) {
      console.log("account.customToken");
      console.log(account?.customToken);
      if (account?.customToken) {
        token.customToken = account.customToken;
        token.userId = account.userId;
      }
      return token;
    },

    async session({ session, token }: { session: any; token: JWT }) {
      if (session) {
        (session as any).customToken = token.customToken;
        (session as any).userId = token.userId;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
  },
};
