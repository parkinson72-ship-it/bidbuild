import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET() {
  try {
    const data = await prisma.user.findMany();
    return Response.json({ success: true, data });
  } catch (error) {
    return Response.json({ success: false, error: String(error) });
  }
}

