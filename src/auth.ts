import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const password = credentials?.password as string | undefined;
        const expected = process.env.AUTH_PASSWORD ?? "ams2026";

        if (password && password === expected) {
          return {
            id: "1",
            name: process.env.AUTH_USER ?? "Anshul Sahu",
            email: "user@ams.local",
          };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  trustHost: true,
});
