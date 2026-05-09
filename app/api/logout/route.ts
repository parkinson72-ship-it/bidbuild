import { auth } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST() {
    try {
        const cookieStore = await cookies();
        const sessionId = cookieStore.get("auth_session")?.value ?? null;

        if (!sessionId) {
            return new Response(
                JSON.stringify({ success: true }),
                { status: 200 }
            );
        }

        // Delete session from Lucia
        await auth.invalidateSession(sessionId);

        // Clear cookie
        cookieStore.delete("auth_session");

        return new Response(
            JSON.stringify({ success: true }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Logout error:", error);
        return new Response(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500 }
        );
    }
}

