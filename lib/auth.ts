import { Lucia } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { prisma } from "@/lib/prisma";

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const auth = new Lucia(adapter, {
  sessionCookie: {
    name: "bidbuild_session",
    attributes: {
      secure: process.env.NODE_ENV === "production"
    }
  },
  getUserAttributes: (data: any) => {
    return {
      email: data.email
    };
  }
});

declare module "lucia" {
  interface Register {
    Lucia: typeof auth;
    DatabaseUserAttributes: {
      email: string;
    };
  }
}
