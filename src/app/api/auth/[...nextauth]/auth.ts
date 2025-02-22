import NextAuth from "next-auth";
import Line from "next-auth/providers/line";

const LINE_CLIENT_ID = "2006950774";
const LINE_CLIENT_SECRET = "5054b2fd8eff4bbae3f7eb410d4fa753";

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  secret: "SECRET",
  providers: [
    Line({
      clientId: LINE_CLIENT_ID,
      clientSecret: LINE_CLIENT_SECRET,
      checks: ["state"],
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl + "/";
    },
  },
});
