import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

//this file is a next-auth convention, and creates a handler with our options
//we export the handler as GET and POST, so that EVERY get and post request our
//app makes is using this handler!
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
