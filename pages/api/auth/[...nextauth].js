import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import bcryptjs from "bcryptjs";
import { connectToDatabase } from "../../../util/mongodb";

export default NextAuth({
  session: {
    jwt: true,
  },
  providers: [
    Providers.Credentials({
      async authorize(credentials) {
        const { client, db } = await connectToDatabase();
        const user = await db
          .collection("admins")
          .findOne({ email: credentials.email });
        if (!user) {
          //   client.close();
          throw new Error("no user found!");
        }

        if (user.status === "inactive") {
          throw new Error("we couldn't log you in! contact the admin!");
        }
        const isValid = await bcryptjs.compare(
          credentials.password,
          user.password
        );
        if (!isValid) {
          //   client.close();
          throw new Error("we couldn't log you in!");
        }
        // client.close();
        return {
          email: user.email,
          role: user.role,
          name: user.name,
          image: user.imageUrl,
        };
      },
    }),
  ],
  callbacks: {
    async jwt(token, user, account) {
      if (account?.accessToken) {
        token.accessToken = account.accessToken;
      }
      if (user?.role) {
        token.role = user.role;
      }
      if (user?.status) {
        token.status = user.status;
      }
      return token;
    },
    async session(session, token) {
      if (token?.accessToken) {
        session.accessToken = token.accessToken;
      }
      if (token?.role) {
        session.user.role = token.role;
      }
      if (token?.status) {
        session.user.status = token.status;
      }
      return session;
    },
  },
});
