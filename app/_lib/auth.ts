import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { createGuest, getGuest } from "./data-service";

const authConfig = {
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET
        })
    ],
    callbacks: {
        // @ts-expect-error any
        authorized({ auth, request }) {
            return !!auth?.user;
        },
        // @ts-expect-error any
        async signIn({ user }) {
            try {
                const existingGuest = await getGuest(user.email);
                if (!existingGuest)
                    await createGuest({ email: user.email as string, fullName: user.name as string })
                return true
            } catch {
                return false;
            }
        },
        // @ts-expect-error any
        async session({ session, user }) {
            const guest = await getGuest(session?.user?.email)
            session.user.guestId = guest?.id;
            return session;
        }
    },
    pages: {
        signIn: '/login'
    }
}

export const { auth, signIn, signOut, handlers } = NextAuth(authConfig);
export const { GET, POST } = handlers;

