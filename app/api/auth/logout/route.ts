import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const res = NextResponse.json({ success: true });

    const session = await getIronSession(req, res, sessionOptions);

    session.destroy();
    await session.save();

    return res;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
