import NextAuth from "next-auth";
import Line from "next-auth/providers/line";


export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  secret: process.env.NEXT_AUTH_SECRET,
  providers: [
    Line({
      clientId: process.env.LINE_CLIENT_ID,
      clientSecret: process.env.LINE_CLIENT_SECRET,
      checks: ["state"],
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl + "/";
    },
  },
});
