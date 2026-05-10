import { NextResponse } from "next/server";

let presenceMap = new Map<string, number>();

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  presenceMap.set(ip, Date.now());
  return NextResponse.json({ ok: true });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const user = searchParams.get("user");

  if (!user) return NextResponse.json({ error: "Missing user" });

  const last = presenceMap.get(user);

  if (!last) {
    return NextResponse.json({
      online: false,
      recent: false,
      lastSeen: "a while ago"
    });
  }

  const diff = Date.now() - last;

  if (diff < 15000) {
    return NextResponse.json({ online: true });
  }

  if (diff < 60000) {
    return NextResponse.json({
      online: false,
      recent: true,
      lastSeen: "just now"
    });
  }

  return NextResponse.json({
    online: false,
    recent: false,
    lastSeen: `${Math.floor(diff / 60000)} minutes ago`
  });
}
