declare module "iron-session" {
  export interface IronSessionOptions {
    cookieName: string;
    password: string;
    cookieOptions?: {
      secure?: boolean;
    };
  }

  export function getIronSession(req: any, res: any, options: any): any;
}
