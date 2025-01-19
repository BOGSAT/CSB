// auth.config.ts
import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

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
          const response = await fetch("http://localhost:5001/auth/login", {
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
          const profileResponse = await fetch(
            "http://localhost:5001/auth/profile",
            {
              headers: {
                Authorization: `Bearer ${data.access_token}`,
              },
            }
          );

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
    async signIn({ account }) {
      console.log(account.id_token);
      try {
        const response = await fetch(
          "http://localhost:5001/auth/google/verify",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              idToken: account?.id_token,
            }),
          }
        );
        if (!response.ok) return false;

        const responseData = await response.json();
        console.log(responseData);

        account.customToken = responseData.access_token;
        account.userId = responseData.userId;

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

    async session({ session, token }) {
      if (session) {
        session.customToken = token.customToken;
        session.userId = token.userId;
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
