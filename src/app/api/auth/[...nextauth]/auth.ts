import NextAuth from "next-auth";
import Line from "next-auth/providers/line";


export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  secret: "SECRET",
  providers: [
    Line({
      clientId: process.env.LINE_CLIENT_ID,
      clientSecret: process.env.LINE_CLIENT_SECRET,
      checks: ["state"],
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl + "/";
    },
  },
});
