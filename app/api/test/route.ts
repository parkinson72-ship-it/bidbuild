import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const result = await prisma.$queryRaw`SELECT NOW()`;
    return Response.json({ success: true, result });
  } catch (error) {
    return Response.json({ success: false, error: String(error) });
  }
}
