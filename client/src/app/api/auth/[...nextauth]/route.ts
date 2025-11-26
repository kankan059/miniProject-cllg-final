import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// console.log("🔑 GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
// console.log("🔑 GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET);

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      session.user.role =
        ["admin@gmail.com", "kongkon@admin.com"].includes(session.user?.email || "")
          ? "admin"
          : "user";
      return session;
    },
  },
});

export { handler as GET, handler as POST };
