import { Lucia } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

// Lucia adapter using Prisma models
const adapter = new PrismaAdapter(prisma.session, prisma.user);

// Main Lucia instance
export const auth = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
            secure: process.env.NODE_ENV === "production"
        }
    },
    getUserAttributes: (user) => {
        return {
            email: user.email
        };
    }
});

// Next.js App Router request wrapper
export const validateRequest = async () => {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("auth_session")?.value ?? null;

    if (!sessionId) {
        return {
            user: null,
            session: null
        };
    }

    const { session, user } = await auth.validateSession(sessionId);

    if (!session) {
        cookieStore.delete("auth_session");
    }

    return { user, session };
};

// Lucia module augmentation
declare module "lucia" {
    interface Register {
        Lucia: typeof auth;
        DatabaseUserAttributes: {
            email: string;
        };
    }
}
