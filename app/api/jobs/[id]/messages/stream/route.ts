import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs"; // SSE requires Node runtime

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const stream = new ReadableStream({
    start(controller) {
      let lastId: string | null = null;

      async function sendUpdates() {
        const messages = await prisma.message.findMany({
          where: { jobId: params.id },
          orderBy: { createdAt: "asc" }
        });

        const latest = messages[messages.length - 1];

        if (!latest) return;

        if (latest.id !== lastId) {
          lastId = latest.id;
          controller.enqueue(
            `data: ${JSON.stringify(messages)}\n\n`
          );
        }
      }

      const interval = setInterval(sendUpdates, 1000);

      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    }
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive"
    }
  });
}
