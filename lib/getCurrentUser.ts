import { validateRequest } from "@/lib/auth";

export async function getCurrentUser() {
    const { user, session } = await validateRequest();

    if (!session || !user) {
        return null;
    }

    return user;
}

