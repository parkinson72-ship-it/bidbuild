import type { IronSessionOptions } from "iron-session";

export const sessionOptions: IronSessionOptions = {
  password: process.env.SESSION_PASSWORD as string,
  cookieName: "bidbuild_session",
  cookieOptions: {
    secure: false, // IMPORTANT FIX
  },
};

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: number;
      email: string;
    };
  }
}

