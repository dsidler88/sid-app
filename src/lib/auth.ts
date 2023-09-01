//data about currently logged in user
//known to some as "session.ts"
import { getServerSession } from "next-auth/next";
import { NextAuthOptions, User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import jsonwebtoken from "jsonwebtoken";
import { SessionInterface, UserProfile } from "../../common.types";
import { createUser, getUser } from "./actions";
import { JWT } from "next-auth/jwt";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  jwt: {
    //very important this is how we generate the token that is used for authenticating many user-specific requests
    //it's not fully automatic, still need an api route to fetch it
    encode: ({ secret, token }) => {
      const encodedToken = jsonwebtoken.sign(
        {
          ...token,
          iss: "grafbase",
          exp: Math.floor(Date.now() / 1000) + 60 * 60000,
        },
        secret
      );
      return encodedToken;
    },
    decode: async ({ secret, token }) => {
      const decodedToken = jsonwebtoken.verify(token!, secret) as JWT;
      return decodedToken;
    },
  },

  theme: {
    colorScheme: "light",
    logo: "/logo.svg",
  },
  callbacks: {
    //callback is a function that is called when a user signs in
    //we return the modified session object
    async session({ session }) {
      const email = session?.user?.email as string;

      //create a new session with both the google user and the db user
      try {
        const data = (await getUser(email)) as { user?: UserProfile };
        const newSession = {
          //here's where we join the google user with the db user
          ...session,
          user: { ...session.user, ...data?.user },
        };
        return newSession;
      } catch (error) {
        console.log("session error");
        console.log(error);
        //type error if you don't return a session
        return session;
      }
    },
    //these are two types from next-auth, one for google auth, one for db?
    async signIn({ user }: { user: AdapterUser | User }) {
      //which type is this user

      try {
        //bare bones next-auth fun
        const userExists = (await getUser(user?.email as string)) as {
          user?: UserProfile;
        };

        //if they don't exist create. having a user will allow us to attach projects to them
        if (!userExists.user) {
          await createUser(
            user.name as string,
            user.email as string,
            user.image as string
          );
        }
        //just return true after we create the user
        return true;
      } catch (error: any) {
        console.log(error);
        return false;
      }
    },
  },
};

export async function getCurrentUser() {
  //specify the type of session. SessionInterface simply EXTENDS session
  //adding some things from Google like id, email, avatar URL, etc.
  const session = (await getServerSession(authOptions)) as SessionInterface;
  return session;
}

///we don't want to just return a google user. we want to hook up the google user to our own DB user, and make the session return the union of the two. this merge is done in callbacks/session
