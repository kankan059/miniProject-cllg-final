import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    // GOOGLE LOGIN
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),

    // EMAIL / PASSWORD LOGIN
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials) return null;

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          }
        );

        const data = await res.json();
        if (!res.ok || !data.user) return null;

        //  DB ROLE DIRECT PASS
        return {
          id: data.user._id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role, // admin / user
        };
      },
    }),
  ],

  

  session: {
    strategy: "jwt",
  },

  
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role; //  DB role
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  
});


export { handler as GET, handler as POST };
