import { NextResponse } from "next/server";
import { putObject } from "@/lib/r2";
import { validateRequest } from "@/lib/auth";

export async function POST(req: Request) {
  const { user } = await validateRequest();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  // Validate file size (10MB max)
  const MAX_SIZE = 10 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "File too large (max 10MB)" },
      { status: 400 }
    );
  }

  // Allowed file types
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf"
  ];

  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json(
      { error: "Unsupported file type" },
      { status: 400 }
    );
  }

  // Generate unique key
  const ext = file.name.split(".").pop();
  const key = `uploads/${crypto.randomUUID()}.${ext}`;

  // Convert File → Buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Upload to R2
  await putObject(key, buffer, file.type);

  const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;

  return NextResponse.json({
    url: publicUrl,
    name: file.name,
    type: file.type
  });
}
