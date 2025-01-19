import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

const {
  handlers: { GET, POST },
  auth,
} = NextAuth(authConfig);

export { GET, POST };
