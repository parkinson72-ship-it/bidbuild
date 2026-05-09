import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { compare } from "bcryptjs";

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return new Response(
                JSON.stringify({ error: "Missing email or password" }),
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return new Response(
                JSON.stringify({ error: "Invalid credentials" }),
                { status: 401 }
            );
        }

        const validPassword = await compare(password, user.hashedPassword);

        if (!validPassword) {
            return new Response(
                JSON.stringify({ error: "Invalid credentials" }),
                { status: 401 }
            );
        }

        // ⭐ Lucia v3 requires 2 args
        const session = await auth.createSession(user.id, {});

        // ⭐ Lucia v3 requires session.id, not session object
        const sessionCookie = auth.createSessionCookie(session.id);

        const cookieStore = await cookies();
        cookieStore.set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes
        );

        return new Response(
            JSON.stringify({ success: true }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Login error:", error);
        return new Response(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500 }
        );
    }
}
