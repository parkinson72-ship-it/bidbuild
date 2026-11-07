import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { putObject } from "@/lib/r2";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "Photo too large (max 5MB)" },
      { status: 400 }
    );
  }
  const ext = EXT_BY_TYPE[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: "Please upload a JPG, PNG or WebP image" },
      { status: 400 }
    );
  }

  const key = `profile-photos/${userId}-${crypto.randomUUID()}.${ext}`;
  await putObject(key, Buffer.from(await file.arrayBuffer()), file.type);
  const url = `${process.env.R2_PUBLIC_URL}/${key}`;

  await prisma.user.update({ where: { id: userId }, data: { image: url } });

  return NextResponse.json({ url });
}
