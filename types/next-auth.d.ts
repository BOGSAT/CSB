declare module "next-auth" {
  interface Session {
    customToken?: string;
    userId?: string;
  }
  interface Account {
    customToken?: string;
    userId?: string;
    id_token?: string; 
  }
  interface JWT {
    customToken?: string;
    userId?: string;
  }
}
